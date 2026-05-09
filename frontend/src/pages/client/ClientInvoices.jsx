import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { invoicesApi } from '../../api/invoicesApi'
import toast from 'react-hot-toast'

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    invoicesApi.clientGetAll()
      .then(({ data }) => setInvoices(data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const downloadPdf = async (invoice) => {
    try {
      const { data } = await invoicesApi.clientDownload(invoice.id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `${invoice.invoice_number}.pdf`; a.click()
    } catch { toast.error('Erreur de téléchargement.') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Mes factures</h1>
        <p className="text-gray-500 text-sm">Gérez et payez vos factures</p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-card shadow-card p-16 text-center">
          <p className="text-5xl mb-4">🧾</p>
          <p className="text-gray-400">Aucune facture.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-card shadow-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-dark">{inv.invoice_number}</h3>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-sm text-gray-500">{inv.service_request?.service?.name}</p>
                  <p className="text-xl font-extrabold text-primary mt-1">{inv.total?.toLocaleString('fr-MA')} MAD</p>
                  {inv.due_date && <p className="text-xs text-gray-400">Échéance : {inv.due_date}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/client/invoices/${inv.id}`} className="bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                    Détail
                  </Link>
                  {inv.status === 'unpaid' && (
                    <Link to={`/client/invoices/${inv.id}/pay`} className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition-all">
                      💳 Payer
                    </Link>
                  )}
                  <button onClick={() => downloadPdf(inv)} className="bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
                    📥 PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
