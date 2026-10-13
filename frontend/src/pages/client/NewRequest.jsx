import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { servicesApi } from '../../api/servicesApi'
import { requestsApi } from '../../api/requestsApi'

export default function NewRequest() {
  const navigate      = useNavigate()
  const [params]      = useSearchParams()
  const serviceId     = params.get('service_id')
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(false)
  const [files, setFiles]       = useState([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { service_id: serviceId || '' }
  })

  useEffect(() => {
    servicesApi.getAll().then(({ data }) => {
      setServices(data.data || data)
      if (serviceId) setValue('service_id', serviceId)
    })
  }, [serviceId])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v) })
      files.forEach(f => fd.append('files[]', f))

      await requestsApi.clientCreate(fd)
      toast.success('Demande envoyée ! Nous vous contacterons très bientôt.')
      navigate('/client/requests')
    } catch (err) {
      const errs = err.response?.data?.errors
      if (errs) Object.values(errs).forEach(e => toast.error(e[0]))
      else toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-dark">Nouvelle demande</h1>
        <p className="text-gray-500 text-sm mt-1">Les champs marqués d’un astérisque sont obligatoires. Le montant sera défini après analyse technique.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-card shadow-card p-8 space-y-6">
        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Mission souhaitée *</label>
          <select
            className="input"
            {...register('requested_mission', { required: 'Veuillez préciser la mission souhaitée' })}
            onChange={(event) => {
              const selected = services.find(service => service.name === event.target.value)
              setValue('service_id', selected?.id || '')
            }}
          >
            <option value="">Sélectionner une mission</option>
            {services.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          {errors.requested_mission && <p className="text-red-500 text-xs mt-1">{errors.requested_mission.message}</p>}
          <p className="text-xs text-gray-400 mt-1">La mission pourra être précisée après analyse technique.</p>
          <input type="hidden" {...register('service_id')} />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Nom ou titre du projet *</label>
          <input
            className="input"
            placeholder="Ex : Immeuble résidentiel à Tunis"
            {...register('title', { required: 'Titre requis', minLength: { value: 5, message: 'Minimum 5 caractères' } })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Description détaillée *</label>
          <textarea
            className="input resize-none"
            rows={6}
            placeholder="Décrivez le besoin, les contraintes connues et les objectifs techniques..."
            {...register('description', { required: 'Description requise', minLength: { value: 20, message: 'Minimum 20 caractères' } })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Type de bâtiment ou d’ouvrage *</label>
            <input className="input" placeholder="Immeuble, pont, hangar..." {...register('building_type', { required: 'Type requis' })} />
            {errors.building_type && <p className="text-red-500 text-xs mt-1">{errors.building_type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Localisation *</label>
            <input className="input" placeholder="Ville, adresse ou site" {...register('location', { required: 'Localisation requise' })} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Nature de l’intervention *</label>
            <select className="input" {...register('intervention_type', { required: 'Nature requise' })}>
              <option value="">Sélectionner</option>
              <option value="new_build">Construction neuve</option>
              <option value="extension">Extension</option>
              <option value="rehabilitation">Réhabilitation</option>
            </select>
            {errors.intervention_type && <p className="text-red-500 text-xs mt-1">{errors.intervention_type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Surface approximative</label>
            <input type="number" min="0" className="input" placeholder="m²" {...register('approximate_surface', { valueAsNumber: true, min: { value: 0, message: 'Valeur positive' } })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Nombre de niveaux</label>
            <input type="number" min="1" className="input" {...register('levels_count', { valueAsNumber: true, min: { value: 1, message: 'Minimum 1' } })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Échéance souhaitée</label>
            <input type="date" className="input" {...register('desired_deadline')} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-dark mb-1.5">Documents déjà disponibles</label>
            <textarea className="input resize-none" rows={2} placeholder="Plans, levé topographique, étude géotechnique..." {...register('available_documents')} />
          </div>
          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Contraintes budgétaires</label>
            <input
              className="input"
              placeholder="Facultatif — ne constitue pas un tarif"
              {...register('approximate_budget')}
            />
            <p className="text-xs text-gray-400 mt-1">Optionnel — aide à calibrer le devis</p>
          </div>

        </div>

        {/* Files */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Fichiers joints</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('fileInput').click()}>
            <p className="text-sm text-gray-400">Cliquez ou glissez vos fichiers ici</p>
            <p className="text-xs text-gray-300 mt-1">PDF, DWG ou IFC — Max 20 Mo par fichier, 5 fichiers</p>
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {files.map((f, i) => (
                  <span key={i} className="bg-primary-light text-primary text-xs px-3 py-1 rounded-full font-medium">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={e => setFiles(Array.from(e.target.files))}
            accept=".pdf,.dwg,.ifc"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-btn hover:border-gray-300 transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-dark-nav text-white font-bold py-3 rounded-btn hover:bg-primary transition-all disabled:opacity-60"
          >
            {loading ? 'Transmission...' : 'Soumettre un projet'}
          </button>
        </div>
      </form>
    </div>
  )
}
