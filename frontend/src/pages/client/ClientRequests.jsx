import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { requestsApi } from '../../api/requestsApi'

const STATUSES = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'discussion', label: 'En discussion' },
  { value: 'quote_sent', label: 'Devis envoyé' },
  { value: 'paid', label: 'Payées' },
  { value: 'completed', label: 'Terminées' },
]

export default function ClientRequests() {
  const [requests, setRequests] = useState([])
  const [status, setStatus]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    requestsApi.clientGetAll({ status: status || undefined })
      .then(({ data }) => setRequests(data.data || []))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Mes demandes</h1>
          <p className="text-gray-500 text-sm">Suivez l'avancement de vos projets</p>
        </div>
        <Link to="/client/requests/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle demande
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              status === s.value ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-card shadow-card p-16 text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 font-medium">Aucune demande trouvée.</p>
          <Link to="/client/requests/new" className="btn-primary mt-4 inline-flex">Créer une demande</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-card shadow-card p-6 hover:shadow-hover transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-dark truncate">{req.title}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-gray-500">{req.service?.name || req.pack?.name || '—'}</p>
                  <p className="text-xs text-gray-400 mt-1">{req.created_at}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.has_conversation && (
                    <Link to={`/client/requests/${req.id}/chat`} className="text-sm font-semibold text-primary hover:underline px-3 py-1.5 bg-primary-light rounded-lg">
                      💬 Discussion
                    </Link>
                  )}
                  {['quote_sent', 'quote_accepted'].includes(req.status) && (
                    <Link to="/client/quotes" className="text-sm font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-all">
                      Voir devis
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
