import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { quotesApi } from '../../api/quotesApi'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

export default function AdminQuotes() {
  const [quotes, setQuotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('')

  const load = () => {
    setLoading(true)
    quotesApi.adminGetAll({ search, status })
      .then(({ data }) => setQuotes(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, status])

  const sendQuote = async (q) => {
    try {
      await quotesApi.adminSend(q.id)
      toast.success('Devis envoyé au client.')
      load()
    } catch { toast.error('Erreur.') }
  }

  const convert = async (q) => {
    if (!confirm('Convertir ce devis en facture ?')) return
    try {
      await quotesApi.adminConvert(q.id)
      toast.success('Facture créée.')
      load()
    } catch { toast.error('Erreur.') }
  }

  const download = async (q) => {
    try {
      const { data } = await quotesApi.adminDownload(q.id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `devis-${q.quote_number}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Erreur téléchargement.') }
  }

  const statuses = ['draft', 'sent', 'accepted', 'refused', 'converted']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Devis</h1>
          <p className="text-sm text-gray-400 mt-1">{quotes.length} devis</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="input pl-9" placeholder="Rechercher (numéro, client...)" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
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
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Demande</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Montant TTC</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="table-row">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-primary">{q.quote_number}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <img src={q.service_request?.client?.avatar_url} className="w-7 h-7 rounded-full" alt="" />
                      <span className="font-medium text-dark">{q.service_request?.client?.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-[180px] truncate">{q.service_request?.title}</td>
                  <td className="px-5 py-4 font-bold text-dark">{Number(q.total_ttc ?? 0).toLocaleString('fr-MA')} MAD</td>
                  <td className="px-5 py-4"><StatusBadge status={q.status} /></td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{q.created_at}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/quotes/${q.id}`} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Voir">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      {q.status === 'draft' && (
                        <button onClick={() => sendQuote(q)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Envoyer au client">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                      )}
                      {q.status === 'accepted' && (
                        <button onClick={() => convert(q)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Convertir en facture">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                      )}
                      <button onClick={() => download(q)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger PDF">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quotes.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📄</p>
              <p>Aucun devis pour le moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
