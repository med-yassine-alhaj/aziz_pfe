import { useState, useEffect } from 'react'
import { packsApi } from '../../api/packsApi'
import { servicesApi } from '../../api/servicesApi'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', is_active: true, service_ids: [] }

export default function AdminPacks() {
  const [packs, setPacks]         = useState([])
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([packsApi.adminGetAll(), servicesApi.adminGetAll()])
      .then(([p, s]) => {
        setPacks(p.data.data ?? p.data)
        setServices(s.data.data ?? s.data)
      })
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (pack) => {
    setEditing(pack)
    setForm({
      name: pack.name,
      description: pack.description ?? '',
      is_active: pack.is_active,
      service_ids: (pack.services ?? []).map(s => s.id),
    })
    setModalOpen(true)
  }

  const toggleService = (id) => {
    setForm(p => ({
      ...p,
      service_ids: p.service_ids.includes(id)
        ? p.service_ids.filter(s => s !== id)
        : [...p.service_ids, id]
    }))
  }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Le nom est requis.')
    setSaving(true)
    try {
      const payload = { name: form.name, description: form.description, is_active: form.is_active ? 1 : 0, service_ids: form.service_ids }
      if (editing) {
        await packsApi.update(editing.id, payload)
        toast.success('Pack mis à jour.')
      } else {
        await packsApi.create(payload)
        toast.success('Pack créé.')
      }
      setModalOpen(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erreur.')
    } finally { setSaving(false) }
  }

  const toggle = async (pack) => {
    try {
      await packsApi.toggle(pack.id)
      setPacks(prev => prev.map(p => p.id === pack.id ? { ...p, is_active: !p.is_active } : p))
    } catch { toast.error('Erreur.') }
  }

  const destroy = async (pack) => {
    if (!confirm(`Supprimer le pack "${pack.name}" ?`)) return
    try {
      await packsApi.delete(pack.id)
      toast.success('Supprimé.')
      load()
    } catch { toast.error('Erreur.') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Packs</h1>
          <p className="text-sm text-gray-400 mt-1">{packs.length} pack{packs.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau pack
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packs.map(pack => (
            <div key={pack.id} className="card p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-dark text-lg">{pack.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{pack.description}</p>
                </div>
                <button onClick={() => toggle(pack)} className={`flex-shrink-0 ml-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${pack.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pack.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {pack.is_active ? 'Actif' : 'Inactif'}
                </button>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Services inclus ({(pack.services ?? []).length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {(pack.services ?? []).map(s => (
                    <span key={s.id} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                  ))}
                  {(pack.services ?? []).length === 0 && <span className="text-xs text-gray-400">Aucun service associé</span>}
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(pack)} className="flex-1 btn-outline text-sm py-2">Modifier</button>
                <button onClick={() => destroy(pack)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {packs.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p>Aucun pack pour le moment.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le pack' : 'Nouveau pack'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nom du pack" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description du pack..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services inclus</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {services.map(svc => (
                <label key={svc.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${form.service_ids.includes(svc.id) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" className="accent-primary" checked={form.service_ids.includes(svc.id)} onChange={() => toggleService(svc.id)} />
                  <span className="text-sm text-dark">{svc.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">{form.service_ids.length} service{form.service_ids.length > 1 ? 's' : ''} sélectionné{form.service_ids.length > 1 ? 's' : ''}</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} className={`w-10 h-5 rounded-full relative transition-all ${form.is_active ? 'bg-primary' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-600">{form.is_active ? 'Actif (visible sur le site)' : 'Inactif (masqué)'}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Annuler</button>
            <button onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
