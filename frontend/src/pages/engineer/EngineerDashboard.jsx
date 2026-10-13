import { useEffect, useState } from 'react'
import { projectsApi } from '../../api/projectsApi'

export default function EngineerDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsApi.getAll('engineer').then(({ data }) => setProjects(data.data?.data || data.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark">Mes projets affectés</h1>
      <p className="text-gray-500 text-sm mt-1">Seuls les dossiers qui vous sont affectés sont visibles.</p>
      {loading ? <p className="py-10 text-gray-500">Chargement...</p> : (
        <div className="grid gap-4 mt-6">
          {projects.map(project => (
            <article key={project.id} className="bg-white rounded-card shadow-card p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs text-primary font-bold">{project.reference}</p>
                  <h2 className="text-lg font-bold text-dark">{project.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{project.stage_label || project.technical_stage}</p>
                </div>
                <span className="text-primary font-bold">{project.technical_progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mt-5">
                <div className="h-2 bg-primary rounded-full" style={{ width: `${project.technical_progress}%` }} />
              </div>
            </article>
          ))}
          {!projects.length && <p className="bg-white rounded-card p-6 text-gray-500">Aucun projet affecté.</p>}
        </div>
      )}
    </div>
  )
}
