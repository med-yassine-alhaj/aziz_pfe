import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await authRegister(data)
      toast.success(`Bienvenue, ${user.name} !`)
      navigate('/client/dashboard', { replace: true })
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach(e => toast.error(e[0]))
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 bg-surface">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-card shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">F</span>
            </div>
            <h1 className="text-2xl font-extrabold text-dark">Créer un compte</h1>
            <p className="text-gray-500 text-sm mt-1">Rejoignez F_MCOM gratuitement</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nom complet *</label>
                <input
                  className="input"
                  placeholder="Votre nom"
                  {...register('name', { required: 'Nom requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Téléphone</label>
                <input
                  className="input"
                  placeholder="+212 6XX-XXXXXX"
                  {...register('phone')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
              <input
                type="email"
                className="input"
                placeholder="votre@email.ma"
                {...register('email', { required: 'Email requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Mot de passe *</label>
              <input
                type="password"
                className="input"
                placeholder="Minimum 8 caractères"
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Confirmer le mot de passe *</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('password_confirmation', {
                  required: 'Confirmation requise',
                  validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas',
                })}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark-nav text-white font-bold py-3 rounded-btn hover:bg-primary transition-all disabled:opacity-60"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
