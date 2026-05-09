import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import api from '../../api/axios'

export default function ClientDashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/client/dashboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center pt-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { stats, recent_requests, recent_invoices } = data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Demandes en attente"   value={stats.pending_requests}   icon="📋" color="orange" />
        <StatCard label="En discussion"          value={stats.active_discussions} icon="💬" color="blue" />
        <StatCard label="Devis reçus"            value={stats.quotes_sent}        icon="📄" color="violet" />
        <StatCard label="Factures impayées"      value={stats.unpaid_invoices}    icon="🧾" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-dark">Dernières demandes</h2>
            <Link to="/client/requests" className="text-sm text-primary font-medium hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recent_requests?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune demande pour l'instant.</p>
            ) : (
              recent_requests?.map(req => (
                <Link key={req.id} to={`/client/requests/${req.id}/chat`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-dark">{req.title}</p>
                      <p className="text-xs text-gray-400">{req.service?.name || req.pack?.name || 'Service'}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-dark">Dernières factures</h2>
            <Link to="/client/invoices" className="text-sm text-primary font-medium hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recent_invoices?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune facture.</p>
            ) : (
              recent_invoices?.map(inv => (
                <Link key={inv.id} to={`/client/invoices/${inv.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-dark">{inv.invoice_number}</p>
                      <p className="text-xs text-gray-400">{inv.total?.toLocaleString('fr-MA')} MAD</p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick action */}
      <div className="bg-primary-light rounded-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-dark">Besoin d'un service ?</h3>
          <p className="text-sm text-gray-600 mt-1">Envoyez une demande et obtenez un devis personnalisé.</p>
        </div>
        <Link to="/client/requests/new" className="btn-primary whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle demande
        </Link>
      </div>
    </div>
  )
}
