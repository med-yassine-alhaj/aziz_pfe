import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { invoicesApi } from '../../api/invoicesApi'
import toast from 'react-hot-toast'

export default function InvoiceDetails() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    invoicesApi.clientGetOne(id)
      .then(({ data }) => setInvoice(data.data || data))
      .finally(() => setLoading(false))
  }, [id])

  const downloadPdf = async () => {
    try {
      const { data } = await invoicesApi.clientDownload(id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${invoice.invoice_number}.pdf`; a.click()
    } catch { toast.error('Erreur de téléchargement.') }
  }

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!invoice) return <p className="text-center text-gray-400 pt-20">Facture introuvable.</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">{invoice.invoice_number}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={invoice.status} />
            {invoice.due_date && <span className="text-xs text-gray-400">Échéance : {invoice.due_date}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadPdf} className="btn-outline text-sm">📥 PDF</button>
          {invoice.status === 'unpaid' && (
            <Link to={`/client/invoices/${id}/pay`} className="btn-primary text-sm">💳 Payer</Link>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-dark">Lignes de facturation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Désignation</th>
                <th className="px-5 py-3 text-center">Qté</th>
                <th className="px-5 py-3 text-right">P.U. HT</th>
                <th className="px-5 py-3 text-center">TVA</th>
                <th className="px-5 py-3 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map(item => (
                <tr key={item.id} className="table-row">
                  <td className="px-5 py-4">
                    <p className="font-medium text-dark text-sm">{item.title}</p>
                    {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                  </td>
                  <td className="px-5 py-4 text-center text-sm">{item.quantity}</td>
                  <td className="px-5 py-4 text-right text-sm">{item.unit_price?.toLocaleString('fr-MA')} MAD</td>
                  <td className="px-5 py-4 text-center text-sm">{item.tax_rate}%</td>
                  <td className="px-5 py-4 text-right font-semibold text-sm">{item.total?.toLocaleString('fr-MA')} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-gray-100 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600"><span>Sous-total HT</span><span>{invoice.subtotal?.toLocaleString('fr-MA')} MAD</span></div>
            {invoice.discount_amount > 0 && <div className="flex justify-between text-sm text-red-600"><span>Remise</span><span>-{invoice.discount_amount?.toLocaleString('fr-MA')} MAD</span></div>}
            <div className="flex justify-between text-sm text-gray-600"><span>TVA</span><span>{invoice.tax_amount?.toLocaleString('fr-MA')} MAD</span></div>
            <div className="flex justify-between text-base font-extrabold text-dark pt-2 border-t border-gray-200">
              <span>Total TTC</span>
              <span className="text-primary">{invoice.total?.toLocaleString('fr-MA')} MAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment history */}
      {invoice.payments?.length > 0 && (
        <div className="bg-white rounded-card shadow-card p-5">
          <h2 className="font-bold text-dark mb-4">Historique des paiements</h2>
          {invoice.payments.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-surface rounded-xl mb-2">
              <div>
                <p className="text-sm font-medium text-dark">{p.method_label}</p>
                <p className="text-xs text-gray-400">{p.created_at}</p>
                {p.accountant_comment && <p className="text-xs text-red-500 mt-1">{p.accountant_comment}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-dark">{p.amount?.toLocaleString('fr-MA')} MAD</p>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
