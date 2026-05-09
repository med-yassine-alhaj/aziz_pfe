import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { requestsApi } from '../../api/requestsApi'

const STATUSES = ['', 'pending', 'discussion', 'quote_sent', 'quote_accepted', 'in_progress', 'completed', 'cancelled']

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [status, setStatus]     = useState('')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    requestsApi.adminGetAll({ status: status || undefined, search: search || undefined })
      .then(({ data }) => setRequests(data.data || []))
      .finally(() => setLoading(false))
  }, [status, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Demandes clients</h1>
          <p className="text-gray-500 text-sm">Gérez toutes les demandes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card shadow-card p-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher par client ou titre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input flex-1"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="input sm:w-52">
          <option value="">Tous les statuts</option>
          {STATUSES.filter(Boolean).map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-left">Projet</th>
                <th className="px-5 py-3 text-left">Service</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucune demande trouvée.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="table-row">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-dark">{req.client?.name}</p>
                      <p className="text-xs text-gray-400">{req.client?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 max-w-xs truncate">{req.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{req.service?.name || req.pack?.name || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={req.status} /></td>
                    <td className="px-5 py-4 text-xs text-gray-400">{req.created_at}</td>
                    <td className="px-5 py-4 flex gap-2">
                      <Link to={`/admin/requests/${req.id}`} className="text-sm text-primary font-semibold hover:underline">
                        Voir
                      </Link>
                      {req.has_conversation && (
                        <Link to={`/admin/requests/${req.id}/chat`} className="text-sm text-blue-600 font-semibold hover:underline">
                          Chat
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
