import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import { messagesApi } from '../../api/messagesApi'
import toast from 'react-hot-toast'

export default function ClientChat() {
  const { id }              = useParams()
  const { user }            = useAuth()
  const [data, setData]     = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText]     = useState('')
  const [file, setFile]     = useState(null)
  const [sending, setSending] = useState(false)
  const bottomRef           = useRef(null)

  useEffect(() => {
    messagesApi.clientGetChat(id)
      .then(({ data }) => {
        setData(data)
        setMessages(data.messages)
      })
      .catch(() => toast.error('Erreur lors du chargement de la discussion.'))
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!text.trim() && !file) return
    setSending(true)
    try {
      const fd = new FormData()
      if (text.trim()) fd.append('message', text)
      if (file) fd.append('attachment', file)
      const { data: msg } = await messagesApi.clientSend(id, fd)
      setMessages(prev => [...prev, msg])
      setText('')
      setFile(null)
    } catch {
      toast.error('Erreur lors de l\'envoi.')
    } finally {
      setSending(false)
    }
  }

  if (!data) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const req = data.service_request

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-card shadow-card p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-dark">{req.title}</h2>
          <p className="text-xs text-gray-400">{req.service?.name || req.pack?.name}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-gray-400 text-sm">La discussion est ouverte. Envoyez votre premier message.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender?.id === user?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img
                    src={msg.sender?.avatar_url}
                    alt={msg.sender?.name}
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0 self-end"
                  />
                )}
                <div className={`max-w-[70%] ${isMe ? 'order-1' : ''}`}>
                  {!isMe && <p className="text-xs text-gray-400 mb-1 ml-1">{msg.sender?.name}</p>}
                  <div className={`rounded-2xl px-4 py-3 text-sm ${
                    isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-dark shadow-card rounded-bl-sm'
                  }`}>
                    {msg.message && <p className="leading-relaxed">{msg.message}</p>}
                    {msg.attachment_url && (
                      <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-1 mt-2 text-xs underline ${isMe ? 'text-white/80' : 'text-primary'}`}>
                        📎 {msg.attachment_name || 'Pièce jointe'}
                      </a>
                    )}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>{msg.created_at}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-card shadow-card p-4 border-t border-gray-100">
        {file && (
          <div className="flex items-center gap-2 mb-2 bg-primary-light rounded-lg px-3 py-2">
            <span className="text-xs text-primary font-medium">📎 {file.name}</span>
            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 ml-auto text-xs">✕</button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            className="flex-1 bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Écrivez votre message..."
          />
          <button
            onClick={send}
            disabled={sending || (!text.trim() && !file)}
            className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {sending
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
