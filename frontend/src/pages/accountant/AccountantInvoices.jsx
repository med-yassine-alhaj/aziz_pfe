import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { invoicesApi } from '../../api/invoicesApi'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

export default function AccountantInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState('waiting_accountant_validation')

  const load = () => {
    setLoading(true)
    invoicesApi.accountantGetAll({ status })
      .then(({ data }) => setInvoices(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const validate = async (inv) => {
    try {
      await invoicesApi.accountantValidate(inv.id)
      toast.success('Facture validée. Client notifié.')
      load()
    } catch { toast.error('Erreur.') }
  }

  const cancel = async (inv) => {
    if (!confirm('Annuler cette facture ?')) return
    try {
      await invoicesApi.accountantCancel(inv.id)
      toast.success('Facture annulée.')
      load()
    } catch { toast.error('Erreur.') }
  }

  const download = async (inv) => {
    try {
      const { data } = await invoicesApi.accountantDownload(inv.id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `facture-${inv.invoice_number}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Erreur téléchargement.') }
  }

  const exportCsv = async () => {
    try {
      const { data } = await invoicesApi.accountantExport()
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
      const a = document.createElement('a'); a.href = url; a.download = 'factures-export.csv'; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Erreur export.') }
  }

  const statuses = [
    { value: 'waiting_accountant_validation', label: 'À valider' },
    { value: 'payment_pending', label: 'Paiement en attente' },
    { value: 'paid', label: 'Payées' },
    { value: 'cancelled', label: 'Annulées' },
    { value: '', label: 'Toutes' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Factures</h1>
          <p className="text-sm text-gray-400 mt-1">{invoices.length} facture{invoices.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCsv} className="btn-outline flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s.value} onClick={() => setStatus(s.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${status === s.value ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Numéro</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Client</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Montant TTC</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="table-row">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-primary">{inv.invoice_number}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <img src={inv.service_request?.client?.avatar_url} className="w-7 h-7 rounded-full" alt="" />
                      <span className="font-medium text-dark">{inv.service_request?.client?.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-dark">{Number(inv.total_ttc ?? 0).toLocaleString('fr-MA')} MAD</td>
                  <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{inv.created_at}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/accountant/invoices/${inv.id}`} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Détails">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      {inv.status === 'waiting_accountant_validation' && (
                        <button onClick={() => validate(inv)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Valider">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      )}
                      {inv.status === 'waiting_accountant_validation' && (
                        <button onClick={() => cancel(inv)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Annuler">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                      <button onClick={() => download(inv)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="PDF">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🧾</p>
              <p>Aucune facture pour ce filtre.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
