import { useState, useEffect } from 'react'
import { servicesApi } from '../../api/servicesApi'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const CATEGORIES = ['design', 'web', 'video', 'marketing', 'communication', 'branding']

const emptyForm = { name: '', description: '', icon: '', category: 'design', order: 0, is_active: true, image: null }

export default function AdminServices() {
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [preview, setPreview]     = useState(null)

  const load = () => {
    setLoading(true)
    servicesApi.adminGetAll()
      .then(({ data }) => setServices(data.data ?? data))
      .catch(() => toast.error('Erreur chargement.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setPreview(null)
    setModalOpen(true)
  }

  const openEdit = (svc) => {
    setEditing(svc)
    setForm({ name: svc.name, description: svc.description ?? '', icon: svc.icon ?? '', category: svc.category ?? 'design', order: svc.order ?? 0, is_active: svc.is_active, image: null })
    setPreview(svc.image_url ?? null)
    setModalOpen(true)
  }

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setForm(p => ({ ...p, image: f }))
    setPreview(URL.createObjectURL(f))
  }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Le nom est requis.')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('icon', form.icon)
      fd.append('category', form.category)
      fd.append('order', form.order)
      fd.append('is_active', form.is_active ? '1' : '0')
      if (form.image) fd.append('image', form.image)
      if (editing) {
        fd.append('_method', 'PUT')
        await servicesApi.update(editing.id, fd)
        toast.success('Service mis à jour.')
      } else {
        await servicesApi.create(fd)
        toast.success('Service créé.')
      }
      setModalOpen(false)
      load()
    } catch (e) {
      const msg = e.response?.data?.message ?? 'Erreur.'
      toast.error(msg)
    } finally { setSaving(false) }
  }

  const toggle = async (svc) => {
    try {
      await servicesApi.toggle(svc.id)
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_active: !s.is_active } : s))
    } catch { toast.error('Erreur.') }
  }

  const destroy = async (svc) => {
    if (!confirm(`Supprimer "${svc.name}" ?`)) return
    try {
      await servicesApi.delete(svc.id)
      toast.success('Supprimé.')
      load()
    } catch { toast.error('Erreur.') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Services</h1>
          <p className="text-sm text-gray-400 mt-1">{services.length} service{services.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Service</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Catégorie</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Ordre</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc.id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {svc.image_url
                        ? <img src={svc.image_url} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        : <div className="service-icon-wrap w-10 h-10 text-lg flex items-center justify-center rounded-xl">✦</div>
                      }
                      <div>
                        <p className="font-medium text-dark">{svc.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{svc.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 capitalize">{svc.category}</td>
                  <td className="px-5 py-4 text-gray-500">{svc.order}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggle(svc)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${svc.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {svc.is_active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(svc)} className="text-gray-400 hover:text-primary transition-colors p-1.5 hover:bg-primary/10 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => destroy(svc)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🛠️</p>
              <p>Aucun service pour le moment.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le service' : 'Nouveau service'} size="lg">
        <div className="space-y-4">
          {/* Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-surface border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors relative" onClick={() => document.getElementById('svc-img').click()}>
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt="" />
                : <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              }
            </div>
            <input id="svc-img" type="file" accept="image/*" className="hidden" onChange={handleImage} />
            <p className="text-xs text-gray-400">Cliquer pour choisir une image</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nom du service" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
              <input type="number" className="input" value={form.order} onChange={e => setForm(p => ({ ...p, order: +e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icône (nom Heroicon)</label>
              <input className="input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="ex: PaintBrushIcon" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description courte du service..." />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} className={`w-10 h-5 rounded-full relative transition-all ${form.is_active ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-gray-600">{form.is_active ? 'Actif (visible sur le site)' : 'Inactif (masqué)'}</span>
            </div>
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
