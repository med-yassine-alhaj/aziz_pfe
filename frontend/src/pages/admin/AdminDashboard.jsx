import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center pt-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  const { stats, recent_requests } = data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Tableau de bord Admin</h1>
        <p className="text-gray-500 text-sm">Vue globale de l'activité</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Demandes en attente"   value={stats.pending_requests}  icon="📋" color="orange" />
        <StatCard label="En discussion"          value={stats.in_discussion}     icon="💬" color="blue" />
        <StatCard label="Devis à préparer"       value={stats.quotes_to_prepare} icon="📄" color="violet" />
        <StatCard label="En cours de production" value={stats.in_progress}       icon="⚡" color="green" />
        <StatCard label="Terminées"              value={stats.completed}         icon="✅" color="green" />
        <StatCard label="Total clients"          value={stats.total_clients}     icon="👥" color="blue" />
        <StatCard label="Factures impayées"      value={stats.unpaid_invoices}   icon="🧾" color="red" />
      </div>

      <div className="bg-white rounded-card shadow-card">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-dark">Dernières demandes</h2>
          <Link to="/admin/requests" className="text-sm text-primary font-medium hover:underline">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-left">Projet</th>
                <th className="px-5 py-3 text-left">Service</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent_requests?.map(req => (
                <tr key={req.id} className="table-row">
                  <td className="px-5 py-4 text-sm font-medium text-dark">{req.client?.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{req.title}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{req.service?.name || req.pack?.name || '—'}</td>
                  <td className="px-5 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-5 py-4 text-xs text-gray-400">{req.created_at}</td>
                  <td className="px-5 py-4">
                    <Link to={`/admin/requests/${req.id}`} className="text-sm text-primary font-semibold hover:underline">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
