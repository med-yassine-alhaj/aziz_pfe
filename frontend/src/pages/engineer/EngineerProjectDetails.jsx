import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { projectsApi } from '../../api/projectsApi'

const STAGES = {
  documents_to_complete: 'Documents à compléter',
  study_in_progress: 'Étude en cours',
  internal_review: 'Contrôle interne',
  documents_transmitted: 'Documents transmis',
  observations_to_process: 'Observations à traiter',
  mission_closed: 'Mission clôturée',
}

const DOCUMENT_STATES = {
  draft: 'Brouillon',
  to_review: 'À vérifier',
  validated: 'Validé',
}

const TRANSITIONS = {
  documents_to_complete: ['study_in_progress'],
  study_in_progress: ['internal_review', 'documents_to_complete'],
  internal_review: ['documents_transmitted', 'study_in_progress'],
  documents_transmitted: ['observations_to_process', 'mission_closed'],
  observations_to_process: ['internal_review', 'documents_transmitted'],
  mission_closed: [],
}

const INTERVENTIONS = {
  new_build: 'Construction neuve',
  extension: 'Extension',
  rehabilitation: 'Réhabilitation',
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR')
}

export default function EngineerProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingStage, setSavingStage] = useState(false)
  const [stageForm, setStageForm] = useState({ technical_stage: '', technical_progress: 0, comment: '' })
  const [documentForm, setDocumentForm] = useState({ category: '', observations: '', state: 'to_review', file: null })
  const [uploading, setUploading] = useState(false)
  const [updatingDocument, setUpdatingDocument] = useState(null)

  const loadProject = () => projectsApi.getOne('engineer', id)
    .then(({ data }) => {
      const value = data.data || data
      setProject(value)
      setStageForm({
        technical_stage: value.technical_stage,
        technical_progress: value.technical_progress,
        comment: '',
      })
    })

  useEffect(() => {
    loadProject().catch(() => setError('Impossible de charger ce projet ou vous n’y êtes pas affecté.')).finally(() => setLoading(false))
  }, [id])

  const availableStages = useMemo(() => {
    if (!project) return []
    return [project.technical_stage, ...(TRANSITIONS[project.technical_stage] || [])]
  }, [project])

  const updateStage = async (event) => {
    event.preventDefault()
    setSavingStage(true)
    try {
      await projectsApi.updateStage(id, {
        technical_stage: stageForm.technical_stage,
        technical_progress: Number(stageForm.technical_progress),
        comment: stageForm.comment || null,
      })
      await loadProject()
      toast.success('Avancement technique mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'La mise à jour de l’avancement a échoué.')
    } finally {
      setSavingStage(false)
    }
  }

  const uploadDocument = async (event) => {
    event.preventDefault()
    if (!documentForm.file) return toast.error('Sélectionnez un document.')
    const data = new FormData()
    data.append('category', documentForm.category)
    data.append('observations', documentForm.observations)
    data.append('state', documentForm.state)
    data.append('file', documentForm.file)
    setUploading(true)
    try {
      await projectsApi.uploadDocument(id, data)
      setDocumentForm({ category: '', observations: '', state: 'to_review', file: null })
      event.target.reset()
      await loadProject()
      toast.success('Document déposé avec succès.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Le dépôt du document a échoué.')
    } finally {
      setUploading(false)
    }
  }

  const updateDocumentState = async (document, state) => {
    setUpdatingDocument(document.id)
    try {
      await projectsApi.updateDocumentState(id, document.id, { state })
      await loadProject()
      toast.success('État documentaire mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de modifier l’état du document.')
    } finally {
      setUpdatingDocument(null)
    }
  }

  const downloadDocument = async (document) => {
    try {
      const { data } = await projectsApi.downloadDocument(id, document.id)
      const url = URL.createObjectURL(data)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.original_name
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Téléchargement non autorisé.')
    }
  }

  if (loading) return <p className="py-10 text-gray-500">Chargement du dossier...</p>
  if (error || !project) return <div className="space-y-4"><Link to="/engineer/dashboard" className="text-primary hover:underline">← Retour aux projets</Link><p className="bg-red-50 text-red-700 rounded-card p-6">{error || 'Projet introuvable.'}</p></div>

  const request = project.request || {}

  return (
    <div className="space-y-6">
      <Link to="/engineer/dashboard" className="text-sm text-primary font-semibold hover:underline">← Retour aux projets</Link>
      <header className="bg-white rounded-card shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-xs text-primary font-bold">{project.reference}</p>
            <h1 className="text-2xl font-extrabold text-dark mt-1">{project.name}</h1>
            <p className="text-gray-500 mt-1">{STAGES[project.technical_stage] || project.technical_stage}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl font-extrabold text-primary">{project.technical_progress}%</p>
            <p className="text-xs text-gray-500">avancement technique</p>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full mt-5"><div className="h-3 bg-primary rounded-full" style={{ width: `${project.technical_progress}%` }} /></div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-bold text-dark mb-4">Demande d’origine</h2>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-gray-500">Titre</dt><dd className="font-medium">{request.title || '—'}</dd></div>
            <div><dt className="text-gray-500">Mission</dt><dd className="font-medium">{request.requested_mission || request.service?.name || request.pack?.name || '—'}</dd></div>
            <div><dt className="text-gray-500">Description</dt><dd className="text-gray-700 whitespace-pre-line">{request.description || '—'}</dd></div>
          </dl>
        </div>
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-bold text-dark mb-4">Caractéristiques du bâtiment ou ouvrage</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-500">Type</dt><dd className="font-medium">{request.building_type || '—'}</dd></div>
            <div><dt className="text-gray-500">Intervention</dt><dd className="font-medium">{INTERVENTIONS[request.intervention_type] || request.intervention_type || '—'}</dd></div>
            <div><dt className="text-gray-500">Localisation</dt><dd className="font-medium">{request.location || '—'}</dd></div>
            <div><dt className="text-gray-500">Surface</dt><dd className="font-medium">{request.approximate_surface ? `${request.approximate_surface} m²` : '—'}</dd></div>
            <div><dt className="text-gray-500">Niveaux</dt><dd className="font-medium">{request.levels_count ?? '—'}</dd></div>
            <div><dt className="text-gray-500">Échéance</dt><dd className="font-medium">{request.desired_deadline || formatDate(project.due_date)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-bold text-dark mb-4">Avancement et étapes techniques</h2>
        <form onSubmit={updateStage} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <label className="text-sm"><span className="block text-gray-500 mb-1">Étape</span><select className="input" value={stageForm.technical_stage} onChange={e => setStageForm({ ...stageForm, technical_stage: e.target.value })}>{availableStages.map(stage => <option key={stage} value={stage}>{STAGES[stage]}</option>)}</select></label>
          <label className="text-sm"><span className="block text-gray-500 mb-1">Avancement (0–100 %)</span><input className="input" type="number" min="0" max="100" value={stageForm.technical_progress} onChange={e => setStageForm({ ...stageForm, technical_progress: e.target.value })} /></label>
          <label className="text-sm md:col-span-2"><span className="block text-gray-500 mb-1">Commentaire du changement</span><input className="input" maxLength="2000" value={stageForm.comment} onChange={e => setStageForm({ ...stageForm, comment: e.target.value })} placeholder="Observations ou décision technique" /></label>
          <button disabled={savingStage} className="btn-primary md:col-span-4 disabled:opacity-60">{savingStage ? 'Enregistrement...' : 'Enregistrer l’avancement'}</button>
        </form>
      </section>

      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-bold text-dark mb-4">Pièces disponibles dans la demande</h2>
        {!request.files?.length ? <p className="text-sm text-gray-500">Aucune pièce jointe à la demande.</p> : <div className="flex flex-wrap gap-3">{request.files.map(file => <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="text-sm text-primary font-medium bg-primary-light px-3 py-2 rounded-xl">📎 {file.file_name}</a>)}</div>}
      </section>

      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-bold text-dark mb-4">Déposer un document technique</h2>
        <p className="text-xs text-gray-500 mb-4">Formats acceptés : PDF, DWG ou IFC. Taille maximale : 50 Mo. Chaque dépôt crée une nouvelle version.</p>
        <form onSubmit={uploadDocument} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm"><span className="block text-gray-500 mb-1">Catégorie</span><input required className="input" value={documentForm.category} onChange={e => setDocumentForm({ ...documentForm, category: e.target.value })} placeholder="Plan d’exécution, note de calcul..." /></label>
          <label className="text-sm"><span className="block text-gray-500 mb-1">Fichier</span><input required className="input" type="file" accept=".pdf,.dwg,.ifc" onChange={e => setDocumentForm({ ...documentForm, file: e.target.files[0] })} /></label>
          <label className="text-sm"><span className="block text-gray-500 mb-1">État initial</span><select className="input" value={documentForm.state} onChange={e => setDocumentForm({ ...documentForm, state: e.target.value })}>{Object.entries(DOCUMENT_STATES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-sm"><span className="block text-gray-500 mb-1">Observations</span><input className="input" value={documentForm.observations} onChange={e => setDocumentForm({ ...documentForm, observations: e.target.value })} /></label>
          <button disabled={uploading} className="btn-primary md:col-span-2 disabled:opacity-60">{uploading ? 'Dépôt en cours...' : 'Déposer le document'}</button>
        </form>
      </section>

      <section className="bg-white rounded-card shadow-card p-6 overflow-x-auto">
        <h2 className="font-bold text-dark mb-4">Documents techniques et versions</h2>
        {!project.documents?.length ? <p className="text-sm text-gray-500">Aucun document technique déposé.</p> : <table className="w-full text-sm"><thead className="bg-surface text-xs text-gray-500"><tr><th className="p-3 text-left">Document</th><th className="p-3 text-left">Catégorie</th><th className="p-3 text-left">Version</th><th className="p-3 text-left">Auteur / date</th><th className="p-3 text-left">État</th><th className="p-3 text-left">Actions</th></tr></thead><tbody>{project.documents.map(document => <tr key={document.id} className="border-b border-gray-100"><td className="p-3"><p className="font-medium">{document.original_name}</p><p className="text-xs text-gray-500">{document.observations || 'Aucune observation'}</p></td><td className="p-3">{document.category}</td><td className="p-3">v{document.version}</td><td className="p-3">{document.uploader?.name || '—'}<br /><span className="text-xs text-gray-500">{formatDate(document.created_at)}</span></td><td className="p-3"><select disabled={updatingDocument === document.id} className="input py-1" value={document.state} onChange={e => updateDocumentState(document, e.target.value)}>{Object.entries(DOCUMENT_STATES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></td><td className="p-3"><button onClick={() => downloadDocument(document)} className="text-primary font-semibold hover:underline">Télécharger</button></td></tr>)}</tbody></table>}
      </section>

      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-bold text-dark mb-4">Historique du projet</h2>
        {!project.stage_histories?.length ? <p className="text-sm text-gray-500">Aucun changement d’étape enregistré.</p> : <div className="space-y-4">{project.stage_histories.map(history => <div key={history.id} className="border-l-2 border-primary pl-4"><p className="font-medium">{STAGES[history.from_stage] || history.from_stage || 'Création'} → {STAGES[history.to_stage] || history.to_stage}</p><p className="text-xs text-gray-500">{history.user?.name || 'Utilisateur'} · {formatDate(history.created_at)}</p>{history.comment && <p className="text-sm text-gray-600 mt-1">{history.comment}</p>}</div>)}</div>}
      </section>
    </div>
  )
}
