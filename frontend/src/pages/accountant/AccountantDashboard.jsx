import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

export default function AccountantDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/accountant/dashboard')
      .then(({ data }) => setStats(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const s = stats ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Tableau de bord comptable</h1>
        <p className="text-sm text-gray-400 mt-1">Vue d'ensemble financière</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Factures à valider" value={s.pending_validation ?? 0} icon="🕐" color="orange" />
        <StatCard label="Paiements en attente" value={s.pending_payments ?? 0} icon="💳" color="blue" />
        <StatCard label="Revenus ce mois" value={`${Number(s.revenue_this_month ?? 0).toLocaleString('fr-MA')} MAD`} icon="📈" color="green" />
        <StatCard label="Revenus totaux" value={`${Number(s.total_revenue ?? 0).toLocaleString('fr-MA')} MAD`} icon="💰" color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending validation */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark">Factures à valider</h2>
            <Link to="/accountant/invoices" className="text-primary text-xs hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {(s.latest_pending ?? []).map(inv => (
              <div key={inv.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                <div>
                  <p className="font-mono text-xs font-bold text-primary">{inv.invoice_number}</p>
                  <p className="text-sm text-dark mt-0.5">{inv.service_request?.client?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-dark">{Number(inv.total_ttc).toLocaleString('fr-MA')} MAD</p>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
            {!(s.latest_pending?.length) && <p className="text-sm text-gray-400 text-center py-4">Aucune facture en attente</p>}
          </div>
        </div>

        {/* Pending payments */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark">Paiements à vérifier</h2>
            <Link to="/accountant/payments" className="text-primary text-xs hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {(s.latest_payments ?? []).map(pay => (
              <div key={pay.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-dark">{pay.invoice?.service_request?.client?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pay.method_label} · {pay.created_at}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-dark">{Number(pay.amount).toLocaleString('fr-MA')} MAD</p>
                  <StatusBadge status={pay.status} />
                </div>
              </div>
            ))}
            {!(s.latest_payments?.length) && <p className="text-sm text-gray-400 text-center py-4">Aucun paiement en attente</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
