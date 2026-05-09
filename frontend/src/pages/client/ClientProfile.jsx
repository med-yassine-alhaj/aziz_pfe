import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import toast from 'react-hot-toast'

export default function ClientProfile() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar]   = useState(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const fd = new FormData()
      if (data.name) fd.append('name', data.name)
      if (data.phone) fd.append('phone', data.phone)
      if (data.password) {
        fd.append('password', data.password)
        fd.append('password_confirmation', data.password_confirmation)
      }
      if (avatar) fd.append('avatar', avatar)

      const { data: res } = await authApi.updateProfile(fd)
      updateUser(res.data || res)
      toast.success('Profil mis à jour !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Mon profil</h1>
        <p className="text-gray-500 text-sm">Modifiez vos informations personnelles</p>
      </div>

      <div className="bg-white rounded-card shadow-card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={avatar ? URL.createObjectURL(avatar) : user?.avatar_url}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-light"
            />
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" className="hidden" onChange={e => setAvatar(e.target.files[0])} />
            </label>
          </div>
          <div>
            <h3 className="font-bold text-dark">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs text-primary font-semibold bg-primary-light px-3 py-0.5 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Nom complet</label>
              <input className="input" {...register('name', { required: 'Requis', minLength: { value: 2, message: 'Min 2 car.' } })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Téléphone</label>
              <input className="input" {...register('phone')} placeholder="+212 6XX-XXXXXX" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-bold text-dark mb-3">Changer le mot de passe</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nouveau mot de passe</label>
                <input type="password" className="input" placeholder="Laisser vide pour ne pas modifier" {...register('password', { minLength: { value: 8, message: 'Min 8 car.' } })} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              {watch('password') && (
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Confirmer</label>
                  <input type="password" className="input" {...register('password_confirmation', { validate: v => v === watch('password') || 'Ne correspond pas' })} />
                  {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-nav text-white font-bold py-3 rounded-btn hover:bg-primary transition-all disabled:opacity-60"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}
