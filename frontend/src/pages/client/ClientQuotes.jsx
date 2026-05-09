import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { quotesApi } from '../../api/quotesApi'
import toast from 'react-hot-toast'

export default function ClientQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quotesApi.clientGetAll()
      .then(({ data }) => setQuotes(data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id) => {
    if (!confirm('Accepter ce devis ?')) return
    try {
      await quotesApi.clientAccept(id)
      toast.success('Devis accepté !')
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'accepted' } : q))
    } catch { toast.error('Erreur.') }
  }

  const handleRefuse = async (id) => {
    if (!confirm('Refuser ce devis ?')) return
    try {
      await quotesApi.clientRefuse(id)
      toast.success('Devis refusé.')
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'refused' } : q))
    } catch { toast.error('Erreur.') }
  }

  const downloadPdf = async (quote) => {
    try {
      const { data } = await quotesApi.clientDownload(quote.id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${quote.quote_number}.pdf`; a.click()
    } catch { toast.error('Erreur de téléchargement.') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Mes devis</h1>
        <p className="text-gray-500 text-sm">Consultez et répondez à vos devis</p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-card shadow-card p-16 text-center">
          <p className="text-5xl mb-4">📄</p>
          <p className="text-gray-400">Aucun devis reçu pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(q => (
            <div key={q.id} className="bg-white rounded-card shadow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-dark">{q.quote_number}</h3>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="text-sm text-gray-500">{q.service_request?.title}</p>
                  <p className="text-lg font-extrabold text-primary mt-1">{q.total?.toLocaleString('fr-MA')} MAD TTC</p>
                  {q.valid_until && <p className="text-xs text-gray-400">Valide jusqu'au {q.valid_until}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {q.status === 'sent' && (
                    <>
                      <button onClick={() => handleAccept(q.id)} className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
                        ✓ Accepter
                      </button>
                      <button onClick={() => handleRefuse(q.id)} className="bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-200 transition-all">
                        ✕ Refuser
                      </button>
                    </>
                  )}
                  <Link to={`/client/quotes/${q.id}`} className="bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                    Détail
                  </Link>
                  <button onClick={() => downloadPdf(q)} className="bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
                    📥 PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
