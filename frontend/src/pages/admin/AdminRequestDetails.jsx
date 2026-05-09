import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { requestsApi } from '../../api/requestsApi'
import toast from 'react-hot-toast'

const STATUSES = [
  'pending','discussion','quote_sent','quote_accepted','quote_refused',
  'invoice_generated','payment_pending','paid','in_progress','completed','cancelled'
]

export default function AdminRequestDetails() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [req, setReq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    requestsApi.adminGetOne(id)
      .then(({ data }) => { setReq(data.data || data); setNewStatus((data.data || data).status) })
      .finally(() => setLoading(false))
  }, [id])

  const updateStatus = async () => {
    try {
      await requestsApi.adminUpdateStatus(id, { status: newStatus })
      setReq(prev => ({ ...prev, status: newStatus }))
      toast.success('Statut mis à jour.')
    } catch { toast.error('Erreur.') }
  }

  const openConversation = async () => {
    try {
      await requestsApi.adminOpenConv(id)
      toast.success('Discussion ouverte !')
      navigate(`/admin/requests/${id}/chat`)
    } catch { toast.error('Erreur.') }
  }

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!req) return <p className="text-center text-gray-400 pt-20">Demande introuvable.</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">{req.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={req.status} />
            <span className="text-xs text-gray-400">{req.created_at}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {req.has_conversation ? (
            <Link to={`/admin/requests/${id}/chat`} className="btn-violet text-sm">💬 Chat</Link>
          ) : (
            <button onClick={openConversation} className="btn-primary text-sm">Ouvrir discussion</button>
          )}
          <Link to={`/admin/quotes/create?request_id=${req.id}&client_id=${req.client?.id}`} className="btn-outline text-sm">📄 Créer devis</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client info */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h3 className="font-bold text-dark mb-4">Informations client</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src={req.client?.avatar_url} className="w-12 h-12 rounded-xl object-cover" alt="" />
            <div>
              <p className="font-semibold text-dark">{req.client?.name}</p>
              <p className="text-sm text-gray-500">{req.client?.email}</p>
              <p className="text-sm text-gray-400">{req.client?.phone}</p>
            </div>
          </div>
        </div>

        {/* Request details */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h3 className="font-bold text-dark mb-4">Détails de la demande</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{req.service?.name || req.pack?.name || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-medium">{req.approximate_budget || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Deadline</span><span className="font-medium">{req.desired_deadline || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Admin assigné</span><span className="font-medium">{req.assigned_admin?.name || '—'}</span></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h3 className="font-bold text-dark mb-3">Description du besoin</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{req.description}</p>
      </div>

      {/* Files */}
      {req.files?.length > 0 && (
        <div className="bg-white rounded-card shadow-card p-6">
          <h3 className="font-bold text-dark mb-4">Fichiers joints ({req.files.length})</h3>
          <div className="flex flex-wrap gap-3">
            {req.files.map(f => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary-light text-primary text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">
                📎 {f.file_name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Status update */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h3 className="font-bold text-dark mb-4">Changer le statut</h3>
        <div className="flex gap-3">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input flex-1">
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button onClick={updateStatus} className="btn-primary">Mettre à jour</button>
        </div>
      </div>
    </div>
  )
}
