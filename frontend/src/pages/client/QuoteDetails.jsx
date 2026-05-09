import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { quotesApi } from '../../api/quotesApi'
import toast from 'react-hot-toast'

export default function QuoteDetails() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [refusing, setRefusing] = useState(false)

  useEffect(() => {
    quotesApi.clientGetOne(id)
      .then(({ data }) => setQuote(data.data || data))
      .finally(() => setLoading(false))
  }, [id])

  const handleAccept = async () => {
    if (!confirm('Accepter ce devis ?')) return
    setAccepting(true)
    try {
      const response = await quotesApi.clientAccept(id)
      toast.success('Devis accepté ! Redirection vers la facture...')
      // Redirect to invoice after 1 second
      setTimeout(() => {
        navigate(`/client/invoices/${response.data.invoice_id}`)
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'acceptation.')
      setAccepting(false)
    }
  }

  const handleRefuse = async () => {
    if (!confirm('Refuser ce devis ?')) return
    setRefusing(true)
    try {
      await quotesApi.clientRefuse(id)
      toast.success('Devis refusé.')
      setQuote(prev => ({ ...prev, status: 'refused' }))
    } catch { 
      toast.error('Erreur.')
      setRefusing(false)
    }
  }

  const downloadPdf = async () => {
    try {
      const { data } = await quotesApi.clientDownload(id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${quote.quote_number}.pdf`; a.click()
    } catch { toast.error('Erreur de téléchargement.') }
  }

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!quote) return <p className="text-center text-gray-400 pt-20">Devis introuvable.</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">{quote.quote_number}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={quote.status} />
            {quote.valid_until && <span className="text-xs text-gray-400">Valide jusqu'au {quote.valid_until}</span>}
          </div>
        </div>
        <button onClick={downloadPdf} className="btn-outline text-sm">📥 PDF</button>
      </div>

      {/* Items */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-dark">Détail du devis</h2>
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
              {quote.items?.map(item => (
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
        {/* Totals */}
        <div className="p-5 border-t border-gray-100 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total HT</span>
              <span className="font-medium">{quote.subtotal?.toLocaleString('fr-MA')} MAD</span>
            </div>
            {quote.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Remise</span>
                <span>-{quote.discount_amount?.toLocaleString('fr-MA')} MAD</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>TVA</span>
              <span className="font-medium">{quote.tax_amount?.toLocaleString('fr-MA')} MAD</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-dark pt-2 border-t border-gray-200">
              <span>Total TTC</span>
              <span className="text-primary">{quote.total?.toLocaleString('fr-MA')} MAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {quote.status === 'sent' && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-dark">Ce devis attend votre réponse</h3>
            <p className="text-sm text-gray-600 mt-1">Acceptez ce devis pour continuer vers le paiement de votre facture.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAccept} disabled={accepting} className="bg-green-500 text-white font-bold px-6 py-2.5 rounded-btn hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {accepting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Acceptation...</> : <>✓ Accepter</>}
            </button>
            <button onClick={handleRefuse} disabled={refusing} className="bg-red-100 text-red-600 font-bold px-6 py-2.5 rounded-btn hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {refusing ? 'Refus...' : '✕ Refuser'}
            </button>
          </div>
        </div>
      )}

      {quote.status === 'accepted' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-card p-6">
          <p className="text-sm text-green-700">✓ Ce devis a été accepté et une facture a été créée.</p>
        </div>
      )}

      {quote.status === 'refused' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-card p-6">
          <p className="text-sm text-red-700">✕ Ce devis a été refusé.</p>
        </div>
      )}

      {quote.notes && (
        <div className="bg-white rounded-card shadow-card p-5">
          <h3 className="font-semibold text-dark mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}
