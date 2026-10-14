import { useEffect, useState } from 'react'
import { projectsApi } from '../../api/projectsApi'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [engineers, setEngineers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(null)

  const load = async () => {
    const [{ data: projectData }, { data: engineerData }] = await Promise.all([
      projectsApi.getAll('admin'),
      api.get('/admin/engineers'),
    ])
    setProjects(projectData.data?.data || projectData.data || [])
    setEngineers(engineerData.data || engineerData)
  }

  useEffect(() => {
    load().catch(() => setError('Impossible de charger les projets et les ingénieurs.')).finally(() => setLoading(false))
  }, [])

  const assign = async (projectId, engineerId) => {
    setSaving(projectId)
    try {
      await api.put(`/admin/projects/${projectId}/assign-engineer`, { engineer_id: engineerId || null })
      await load()
      toast.success('Responsable ingénieur mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Affectation impossible.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Projets techniques</h1>
        <p className="text-gray-500 text-sm mt-1">Affectez chaque dossier à un ingénieur. L’ingénieur ne verra que ses projets.</p>
      </div>
      {loading ? <p className="py-10 text-gray-500">Chargement des projets...</p> : error ? <p className="bg-red-50 text-red-700 rounded-card p-6">{error}</p> : (
        <div className="bg-white rounded-card shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-gray-500 uppercase"><tr><th className="p-4 text-left">Référence</th><th className="p-4 text-left">Projet</th><th className="p-4 text-left">Stade</th><th className="p-4 text-left">Responsable</th></tr></thead>
            <tbody>
              {!projects.length ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Aucun projet technique.</td></tr> : projects.map(project => (
                <tr key={project.id} className="border-b border-gray-100">
                  <td className="p-4 font-semibold text-primary">{project.reference}</td>
                  <td className="p-4"><p className="font-medium text-dark">{project.name}</p><p className="text-xs text-gray-500">{project.client?.name || 'Client non renseigné'}</p></td>
                  <td className="p-4">{project.stage_label || project.technical_stage}<br /><span className="text-xs text-gray-500">{project.technical_progress}%</span></td>
                  <td className="p-4"><select disabled={saving === project.id} className="input min-w-56" value={project.responsible_engineer?.id || ''} onChange={e => assign(project.id, e.target.value)}><option value="">Non affecté</option>{engineers.map(engineer => <option key={engineer.id} value={engineer.id}>{engineer.name} — {engineer.email}</option>)}</select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
