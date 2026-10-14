import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const engineerPortal = window.location.pathname.startsWith('/engineer')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname
    if (from && from !== '/admin/login') return navigate(from, { replace: true })
    if (role === 'admin') return navigate('/admin/dashboard', { replace: true })
    if (role === 'accountant') return navigate('/accountant/dashboard', { replace: true })
    if (role === 'engineer') return navigate('/engineer/dashboard', { replace: true })
    return navigate('/client/dashboard', { replace: true })
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data)
      if (user.role !== (engineerPortal ? 'engineer' : 'admin')) {
        toast.error(engineerPortal ? 'Ce portail est réservé aux ingénieurs.' : 'Ce portail est réservé aux administrateurs.')
        return navigate('/', { replace: true })
      }
      toast.success(`Bienvenue, ${user.name} !`)
      redirectAfterLogin(user.role)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants admin incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.28),_transparent_40%),linear-gradient(180deg,_#0b1020_0%,_#060814_100%)]">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-white/10 bg-white/95 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur px-8 py-10">
          <div className="text-center mb-8">
            <img src="/engineerium-logo.png" alt="ENGINEERIUM" className="w-28 h-20 mx-auto object-contain mb-4" />
            <p className="text-xs uppercase tracking-[0.35em] text-violet-500 font-semibold">{window.location.pathname.startsWith('/engineer') ? 'Engineer Portal' : 'Admin Portal'}</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">{window.location.pathname.startsWith('/engineer') ? 'Connexion ingénieur' : 'Connexion administrateur'}</h1>
            <p className="text-slate-500 text-sm mt-2">Accès sécurisé aux dossiers autorisés</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{engineerPortal ? 'Email ingénieur' : 'Email administrateur'}</label>
              <input
                type="email"
                className="input"
                placeholder={engineerPortal ? 'ingenieur@engineerium.tn' : 'admin@engineerium.tn'}
                {...register('email', { required: 'Email requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('password', { required: 'Mot de passe requis' })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-btn hover:bg-violet-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : engineerPortal ? 'Entrer dans le portail ingénieur' : 'Entrer dans le portail administrateur'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            {engineerPortal ? 'Portail réservé aux ingénieurs affectés.' : 'Portail réservé aux administrateurs.'}
          </p>
        </div>
      </div>
    </div>
  )
}