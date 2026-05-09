import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { invoicesApi } from '../../api/invoicesApi'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

export default function AccountantInvoiceDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing]   = useState(false)

  const load = () => {
    setLoading(true)
    invoicesApi.accountantGetOne(id)
      .then(({ data: d }) => setData(d.data ?? d))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const validate = async () => {
    setActing(true)
    try {
      await invoicesApi.accountantValidate(id)
      toast.success('Facture validée.')
      load()
    } catch { toast.error('Erreur.') }
    finally { setActing(false) }
  }

  const cancel = async () => {
    if (!confirm('Annuler cette facture ?')) return
    setActing(true)
    try {
      await invoicesApi.accountantCancel(id)
      toast.success('Facture annulée.')
      navigate('/accountant/invoices')
    } catch { toast.error('Erreur.') }
    finally { setActing(false) }
  }

  const download = async () => {
    try {
      const { data: blob } = await invoicesApi.accountantDownload(id)
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `facture-${data.invoice_number}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Erreur téléchargement.') }
  }

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!data) return null

  const req = data.service_request
  const items = data.items ?? []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-dark font-mono">{data.invoice_number}</h1>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-sm text-gray-400 mt-1">{req?.client?.name} — {req?.title}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={download} className="btn-outline flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" /></svg>
            PDF
          </button>
          {data.status === 'waiting_accountant_validation' && (
            <>
              <button onClick={cancel} disabled={acting} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                Annuler
              </button>
              <button onClick={validate} disabled={acting} className="btn-primary text-sm disabled:opacity-50">
                {acting ? 'Validation...' : 'Valider la facture'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Client & request info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-dark mb-3 text-sm">Client</h2>
          <div className="flex items-center gap-3">
            <img src={req?.client?.avatar_url} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <p className="font-medium text-dark">{req?.client?.name}</p>
              <p className="text-sm text-gray-500">{req?.client?.email}</p>
              {req?.client?.phone && <p className="text-sm text-gray-500">{req?.client?.phone}</p>}
            </div>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-dark mb-3 text-sm">Détails facture</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Créée le</span><span className="text-dark">{data.created_at}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Échéance</span><span className="text-dark">{data.due_date ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Prestation</span><span className="text-dark">{req?.service?.name || req?.pack?.name}</span></div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-dark">Lignes de facturation</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Description</th>
              <th className="text-center px-5 py-3 text-gray-400 font-medium">Qté</th>
              <th className="text-right px-5 py-3 text-gray-400 font-medium">Prix HT</th>
              <th className="text-center px-5 py-3 text-gray-400 font-medium">TVA</th>
              <th className="text-right px-5 py-3 text-gray-400 font-medium">Remise</th>
              <th className="text-right px-5 py-3 text-gray-400 font-medium">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-dark">{item.description}</td>
                <td className="px-5 py-4 text-center text-gray-600">{item.quantity}</td>
                <td className="px-5 py-4 text-right text-gray-600">{Number(item.unit_price).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</td>
                <td className="px-5 py-4 text-center text-gray-600">{item.tax_rate}%</td>
                <td className="px-5 py-4 text-right text-gray-600">{Number(item.discount_amount ?? 0).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</td>
                <td className="px-5 py-4 text-right font-bold text-dark">{Number(item.total).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 bg-surface border-t border-gray-100 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total HT</span>
              <span>{Number(data.subtotal_ht ?? 0).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>TVA</span>
              <span>{Number(data.total_tva ?? 0).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
            {Number(data.discount_amount ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Remise globale</span>
                <span>- {Number(data.discount_amount).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-dark border-t border-gray-200 pt-2 text-base">
              <span>Total TTC</span>
              <span className="text-primary">{Number(data.total_ttc ?? 0).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments */}
      {data.payments?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-dark mb-4">Paiements</h2>
          <div className="space-y-3">
            {data.payments.map(pay => (
              <div key={pay.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-dark">{pay.method_label}</p>
                  <p className="text-xs text-gray-400">{pay.created_at}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-dark">{Number(pay.amount).toLocaleString('fr-MA')} MAD</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pay.status === 'validated' ? 'bg-green-100 text-green-700' : pay.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {pay.status_label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation banner */}
      {data.status === 'waiting_accountant_validation' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-800">Cette facture attend votre validation</p>
            <p className="text-sm text-blue-600 mt-1">Vérifiez les montants et validez pour l'envoyer au client.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={cancel} disabled={acting} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">Annuler</button>
            <button onClick={validate} disabled={acting} className="btn-primary text-sm">{acting ? '...' : 'Valider'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
