import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail]   = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/admin/clients', { params: { search } })
      .then(({ data }) => setClients(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  const openDetail = (client) => {
    setSelected(client)
    setDetailLoading(true)
    api.get(`/admin/clients/${client.id}`)
      .then(({ data }) => setDetail(data.data ?? data))
      .catch(() => toast.error('Erreur.'))
      .finally(() => setDetailLoading(false))
  }

  const toggleActive = async (client) => {
    try {
      await api.patch(`/admin/clients/${client.id}/toggle`)
      toast.success(client.is_active ? 'Compte désactivé.' : 'Compte activé.')
      load()
      if (detail?.id === client.id) setDetail(p => ({ ...p, is_active: !p.is_active }))
    } catch { toast.error('Erreur.') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Clients</h1>
          <p className="text-sm text-gray-400 mt-1">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input className="input pl-9" placeholder="Rechercher par nom ou email" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Client</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Téléphone</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Demandes</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Inscription</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={client.avatar_url} className="w-9 h-9 rounded-full" alt="" />
                      <span className="font-medium text-dark">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{client.email}</td>
                  <td className="px-5 py-4 text-gray-500">{client.phone ?? '—'}</td>
                  <td className="px-5 py-4 text-gray-500">{client.service_requests_count ?? 0}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${client.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${client.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {client.is_active ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{client.created_at}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openDetail(client)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir profil">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => toggleActive(client)} className={`p-1.5 rounded-lg transition-colors ${client.is_active ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`} title={client.is_active ? 'Suspendre' : 'Activer'}>
                        {client.is_active
                          ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p>Aucun client pour le moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Client detail modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setDetail(null) }} title="Profil client" size="lg">
        {detailLoading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : detail ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={detail.avatar_url} className="w-16 h-16 rounded-2xl" alt="" />
              <div>
                <h3 className="text-lg font-bold text-dark">{detail.name}</h3>
                <p className="text-sm text-gray-500">{detail.email}</p>
                {detail.phone && <p className="text-sm text-gray-500">{detail.phone}</p>}
              </div>
              <div className="ml-auto">
                <button onClick={() => toggleActive(detail)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${detail.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {detail.is_active ? 'Suspendre' : 'Activer'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Demandes', value: detail.service_requests?.length ?? 0 },
                { label: 'Factures', value: detail.invoices?.length ?? 0 },
                { label: 'Paiements', value: detail.payments?.length ?? 0 },
              ].map(stat => (
                <div key={stat.label} className="bg-surface rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-dark">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {detail.service_requests?.length > 0 && (
              <div>
                <h4 className="font-semibold text-dark mb-3 text-sm">Dernières demandes</h4>
                <div className="space-y-2">
                  {detail.service_requests.slice(0, 5).map(req => (
                    <div key={req.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dark">{req.title}</p>
                        <p className="text-xs text-gray-400">{req.created_at}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
