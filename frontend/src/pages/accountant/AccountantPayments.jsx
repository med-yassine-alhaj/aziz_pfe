import { useState, useEffect } from 'react'
import { paymentsApi } from '../../api/paymentsApi'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function AccountantPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState('pending')
  const [selected, setSelected] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [acting, setActing]     = useState(false)

  const load = () => {
    setLoading(true)
    paymentsApi.accountantGetAll({ status })
      .then(({ data }) => setPayments(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const accept = async (pay) => {
    setActing(true)
    try {
      await paymentsApi.accountantAccept(pay.id)
      toast.success('Paiement validé. Reçu généré et envoyé au client.')
      setSelected(null)
      load()
    } catch { toast.error('Erreur.') }
    finally { setActing(false) }
  }

  const reject = async (pay) => {
    if (!rejectNote.trim()) return toast.error('Veuillez indiquer un motif de rejet.')
    setActing(true)
    try {
      await paymentsApi.accountantReject(pay.id, { note: rejectNote })
      toast.success('Paiement rejeté. Client notifié.')
      setSelected(null)
      setRejectNote('')
      load()
    } catch { toast.error('Erreur.') }
    finally { setActing(false) }
  }

  const methodLabel = {
    bank_transfer: 'Virement bancaire',
    card: 'Carte bancaire',
    cash: 'Espèces',
    check: 'Chèque',
  }

  const statuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'validated', label: 'Validés' },
    { value: 'rejected', label: 'Rejetés' },
    { value: '', label: 'Tous' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Paiements</h1>
        <p className="text-sm text-gray-400 mt-1">Vérification des preuves de paiement</p>
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
        <div className="space-y-3">
          {payments.map(pay => (
            <div key={pay.id} className="card p-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <img src={pay.invoice?.service_request?.client?.avatar_url} className="w-9 h-9 rounded-full" alt="" />
                  <div>
                    <p className="font-medium text-dark">{pay.invoice?.service_request?.client?.name}</p>
                    <p className="text-xs text-gray-400">{pay.created_at}</p>
                  </div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${
                    pay.status === 'validated' ? 'bg-green-100 text-green-700' :
                    pay.status === 'rejected'  ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {pay.status === 'validated' ? 'Validé' : pay.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Facture</p>
                    <p className="font-mono font-bold text-primary">{pay.invoice?.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Méthode</p>
                    <p className="text-dark">{methodLabel[pay.method] ?? pay.method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Montant</p>
                    <p className="font-bold text-dark">{Number(pay.amount).toLocaleString('fr-MA')} MAD</p>
                  </div>
                  {pay.reference && (
                    <div>
                      <p className="text-xs text-gray-400">Référence</p>
                      <p className="text-dark font-mono text-xs">{pay.reference}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {pay.payment_proof_url && (
                  <a href={pay.payment_proof_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Preuve
                  </a>
                )}
                {pay.status === 'pending' && (
                  <button onClick={() => setSelected(pay)} className="btn-primary text-sm">
                    Examiner
                  </button>
                )}
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="text-center py-16 text-gray-400 card">
              <p className="text-4xl mb-3">💳</p>
              <p>Aucun paiement pour ce filtre.</p>
            </div>
          )}
        </div>
      )}

      {/* Examine modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectNote('') }} title="Examen du paiement" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="bg-surface rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={selected.invoice?.service_request?.client?.avatar_url} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <p className="font-medium text-dark">{selected.invoice?.service_request?.client?.name}</p>
                  <p className="text-xs text-gray-400">{selected.invoice?.service_request?.client?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-400">Facture</p>
                  <p className="font-mono font-bold text-primary">{selected.invoice?.invoice_number}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-400">Montant</p>
                  <p className="font-bold text-dark">{Number(selected.amount).toLocaleString('fr-MA')} MAD</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-400">Méthode</p>
                  <p className="text-dark">{methodLabel[selected.method] ?? selected.method}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-dark">{selected.created_at}</p>
                </div>
              </div>
              {selected.notes && (
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Note client</p>
                  <p className="text-sm text-dark">{selected.notes}</p>
                </div>
              )}
            </div>

            {selected.payment_proof_url && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preuve de paiement</p>
                <a href={selected.payment_proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  <span className="text-sm text-primary font-medium">Voir le document</span>
                </a>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif de rejet (si refus)</label>
              <textarea className="input resize-none" rows={2} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Ex: Montant incorrect, document illisible..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => reject(selected)} disabled={acting} className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50 text-sm">
                {acting ? '...' : 'Rejeter'}
              </button>
              <button onClick={() => accept(selected)} disabled={acting} className="flex-1 btn-primary text-sm disabled:opacity-50">
                {acting ? 'Validation...' : 'Valider le paiement'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
