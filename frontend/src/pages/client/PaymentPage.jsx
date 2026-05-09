import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { invoicesApi } from '../../api/invoicesApi'
import toast from 'react-hot-toast'

const METHODS = [
  { value: 'bank_transfer', label: 'Virement bancaire', icon: '🏦', desc: 'Effectuez un virement vers notre compte bancaire' },
  { value: 'cash',          label: 'Espèces',          icon: '💵', desc: 'Paiement en espèces à nos bureaux' },
  { value: 'online_mock',   label: 'Paiement en ligne', icon: '💳', desc: 'Simulation de paiement en ligne (démo)' },
  { value: 'manual',        label: 'Autre',            icon: '📋', desc: 'Autre mode de paiement manuel' },
]

export default function PaymentPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [proof, setProof]     = useState(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { method: 'bank_transfer' } })
  const method = watch('method')

  useEffect(() => {
    invoicesApi.clientGetOne(id).then(({ data }) => setInvoice(data.data || data))
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('method', data.method)
      if (data.transaction_reference) fd.append('transaction_reference', data.transaction_reference)
      if (proof) fd.append('payment_proof', proof)

      await invoicesApi.clientPay(id, fd)
      toast.success('Paiement soumis ! En attente de validation du comptable.')
      navigate('/client/invoices')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du paiement.')
    } finally {
      setLoading(false)
    }
  }

  if (!invoice) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Payer la facture</h1>
        <p className="text-gray-500 text-sm">{invoice.invoice_number}</p>
      </div>

      {/* Amount */}
      <div className="bg-primary-light rounded-card p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Montant à payer</p>
        <p className="text-4xl font-extrabold text-primary">{invoice.total?.toLocaleString('fr-MA')} MAD</p>
        <p className="text-xs text-gray-400 mt-1">TTC, toutes taxes comprises</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-card shadow-card p-6 space-y-6">
        {/* Method */}
        <div>
          <label className="block text-sm font-bold text-dark mb-3">Mode de paiement *</label>
          <div className="space-y-3">
            {METHODS.map(m => (
              <label key={m.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                method === m.value ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-primary/50'
              }`}>
                <input type="radio" value={m.value} {...register('method')} className="hidden" />
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="font-semibold text-dark text-sm">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
                {method === m.value && <span className="ml-auto text-primary font-bold text-lg">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Référence de transaction</label>
          <input
            className="input"
            placeholder="N° de virement, référence de paiement..."
            {...register('transaction_reference')}
          />
          <p className="text-xs text-gray-400 mt-1">Optionnel mais recommandé</p>
        </div>

        {/* Proof */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Preuve de paiement</label>
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => document.getElementById('proofInput').click()}
          >
            {proof ? (
              <p className="text-sm text-primary font-medium">📎 {proof.name}</p>
            ) : (
              <>
                <p className="text-sm text-gray-400">Cliquez pour joindre votre preuve de paiement</p>
                <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG — Max 5 Mo</p>
              </>
            )}
          </div>
          <input
            id="proofInput"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setProof(e.target.files[0])}
          />
        </div>

        {method === 'bank_transfer' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Coordonnées bancaires</p>
            <p>Banque : Attijariwafa Bank</p>
            <p>RIB : XXXXXXXXXXXXXXXXXX</p>
            <p className="mt-2 text-xs">Mentionnez {invoice.invoice_number} dans le motif du virement.</p>
          </div>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-btn hover:border-gray-300 transition-all">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-dark-nav text-white font-bold py-3 rounded-btn hover:bg-primary transition-all disabled:opacity-60">
            {loading ? 'Envoi...' : 'Confirmer le paiement'}
          </button>
        </div>
      </form>
    </div>
  )
}
