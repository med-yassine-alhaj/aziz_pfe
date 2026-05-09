import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { quotesApi } from '../../api/quotesApi'
import { requestsApi } from '../../api/requestsApi'
import toast from 'react-hot-toast'

const emptyItem = { description: '', quantity: 1, unit_price: '', tax_rate: 20, discount_amount: 0 }

function calcItem(item) {
  const base = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
  const afterDiscount = base - (Number(item.discount_amount) || 0)
  const tva = afterDiscount * (Number(item.tax_rate) || 0) / 100
  return { ht: afterDiscount, tva, ttc: afterDiscount + tva }
}

export default function CreateQuote() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requestId = params.get('request_id')

  const [request, setRequest] = useState(null)
  const [items, setItems]     = useState([{ ...emptyItem }])
  const [notes, setNotes]     = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [saving, setSaving]   = useState(false)
  const [loadingReq, setLoadingReq] = useState(!!requestId)

  useEffect(() => {
    if (!requestId) return
    requestsApi.adminGetOne(requestId)
      .then(({ data }) => setRequest(data.data ?? data))
      .catch(() => toast.error('Demande introuvable.'))
      .finally(() => setLoadingReq(false))
  }, [requestId])

  const addItem = () => setItems(p => [...p, { ...emptyItem }])

  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i))

  const updateItem = (i, field, value) => {
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const totals = items.reduce((acc, item) => {
    const c = calcItem(item)
    return { ht: acc.ht + c.ht, tva: acc.tva + c.tva, ttc: acc.ttc + c.ttc }
  }, { ht: 0, tva: 0, ttc: 0 })

  const submit = async (asDraft = true) => {
    const invalid = items.some(it => !it.description.trim() || !it.unit_price)
    if (invalid) return toast.error('Remplissez toutes les lignes (description + prix).')
    if (!requestId) return toast.error('Demande de service manquante.')
    setSaving(true)
    try {
      await quotesApi.adminCreate({
        service_request_id: requestId,
        notes,
        valid_until: validUntil || null,
        status: asDraft ? 'draft' : 'sent',
        items: items.map(it => ({
          description: it.description,
          quantity: Number(it.quantity),
          unit_price: Number(it.unit_price),
          tax_rate: Number(it.tax_rate),
          discount_amount: Number(it.discount_amount),
        }))
      })
      toast.success(asDraft ? 'Devis sauvegardé en brouillon.' : 'Devis envoyé au client.')
      navigate('/admin/quotes')
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erreur.')
    } finally { setSaving(false) }
  }

  if (loadingReq) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark">Nouveau devis</h1>
          {request && <p className="text-sm text-gray-400 mt-1">{request.client?.name} — {request.title}</p>}
        </div>
      </div>

      {/* Client & request info */}
      {request && (
        <div className="card p-5 bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <img src={request.client?.avatar_url} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <p className="font-medium text-dark">{request.client?.name}</p>
              <p className="text-sm text-gray-500">{request.client?.email}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-medium text-dark">{request.title}</p>
              <p className="text-xs text-gray-400">{request.service?.name || request.pack?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="card p-5">
        <h2 className="font-semibold text-dark mb-4">Informations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valable jusqu'au</label>
            <input type="date" className="input" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / conditions</label>
            <input className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Conditions de paiement, remarques..." />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5">
        <h2 className="font-semibold text-dark mb-4">Lignes du devis</h2>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 px-1">
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Qté</div>
            <div className="col-span-2">Prix HT (MAD)</div>
            <div className="col-span-1">TVA %</div>
            <div className="col-span-1">Remise</div>
            <div className="col-span-2 text-right">Total TTC</div>
            <div className="col-span-1" />
          </div>

          {items.map((item, i) => {
            const c = calcItem(item)
            return (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-surface rounded-xl p-3">
                <div className="col-span-4">
                  <input className="input text-sm py-2" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description de la prestation" />
                </div>
                <div className="col-span-1">
                  <input type="number" min="1" className="input text-sm py-2 text-center" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input type="number" min="0" step="0.01" className="input text-sm py-2" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', e.target.value)} placeholder="0.00" />
                </div>
                <div className="col-span-1">
                  <input type="number" min="0" max="100" className="input text-sm py-2 text-center" value={item.tax_rate} onChange={e => updateItem(i, 'tax_rate', e.target.value)} />
                </div>
                <div className="col-span-1">
                  <input type="number" min="0" step="0.01" className="input text-sm py-2" value={item.discount_amount} onChange={e => updateItem(i, 'discount_amount', e.target.value)} />
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-dark">{c.ttc.toLocaleString('fr-MA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="col-span-1 flex justify-center">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          <button onClick={addItem} className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-dark transition-colors mt-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter une ligne
          </button>
        </div>

        {/* Totals */}
        <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total HT</span>
              <span>{totals.ht.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>TVA</span>
              <span>{totals.tva.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
            <div className="flex justify-between font-bold text-dark border-t border-gray-200 pt-2">
              <span>Total TTC</span>
              <span className="text-primary">{totals.ttc.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button onClick={() => navigate(-1)} className="btn-outline">Annuler</button>
        <button onClick={() => submit(true)} disabled={saving} className="btn-outline disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Sauvegarder brouillon'}
        </button>
        <button onClick={() => submit(false)} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Envoi...' : 'Envoyer au client'}
        </button>
      </div>
    </div>
  )
}
