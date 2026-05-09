import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [form, setForm]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => setForm(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }, [])

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }))
  const setSocial = (key, value) => setForm(p => ({ ...p, social_links: { ...(p.social_links ?? {}), [key]: value } }))

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/admin/settings', form)
      toast.success('Paramètres sauvegardés.')
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erreur.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Paramètres de l'agence</h1>
        <p className="text-sm text-gray-400 mt-1">Ces informations apparaissent sur vos devis, factures et reçus.</p>
      </div>

      {/* Agency info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-dark">Informations générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'agence</label>
            <input className="input" value={form.agency_name ?? ''} onChange={e => set('agency_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input" value={form.email ?? ''} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input className="input" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
            <input className="input" value={form.website ?? ''} onChange={e => set('website', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input className="input" value={form.address ?? ''} onChange={e => set('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input className="input" value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input className="input" value={form.country ?? ''} onChange={e => set('country', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° registre de commerce</label>
            <input className="input" value={form.rc_number ?? ''} onChange={e => set('rc_number', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° ICE / TVA</label>
            <input className="input" value={form.ice_number ?? ''} onChange={e => set('ice_number', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Banking */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-dark">Coordonnées bancaires</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la banque</label>
            <input className="input" value={form.bank_name ?? ''} onChange={e => set('bank_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire du compte</label>
            <input className="input" value={form.bank_account_name ?? ''} onChange={e => set('bank_account_name', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN / RIB</label>
            <input className="input font-mono" value={form.bank_iban ?? ''} onChange={e => set('bank_iban', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT / BIC</label>
            <input className="input font-mono" value={form.bank_swift ?? ''} onChange={e => set('bank_swift', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-dark">Mentions légales</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conditions de paiement par défaut</label>
          <textarea className="input resize-none" rows={2} value={form.default_payment_terms ?? ''} onChange={e => set('default_payment_terms', e.target.value)} placeholder="Ex: Paiement à 30 jours date de facture" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mentions légales footer</label>
          <textarea className="input resize-none" rows={3} value={form.legal_footer ?? ''} onChange={e => set('legal_footer', e.target.value)} placeholder="Mentions légales qui apparaissent au bas des documents PDF" />
        </div>
      </div>

      {/* Social */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-dark">Réseaux sociaux</h2>
        <div className="grid grid-cols-2 gap-4">
          {['linkedin', 'instagram', 'facebook', 'twitter'].map(net => (
            <div key={net}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{net}</label>
              <input className="input" value={form.social_links?.[net] ?? ''} onChange={e => setSocial(net, e.target.value)} placeholder={`https://${net}.com/votre-agence`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary px-8 disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
