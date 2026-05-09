import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AccountantLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data)
      if (user.role !== 'accountant') {
        toast.error('Ce portail est réservé aux comptables.')
        return navigate('/', { replace: true })
      }
      toast.success(`Bienvenue, ${user.name} !`)
      navigate('/accountant/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants comptable incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.28),_transparent_40%),linear-gradient(180deg,_#0b1020_0%,_#060814_100%)]">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-white/10 bg-white/95 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur px-8 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 mb-4">
              <span className="text-2xl font-black text-white">C</span>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-green-500 font-semibold">Comptable Portal</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Connexion comptable</h1>
            <p className="text-slate-500 text-sm mt-2">Accès sécurisé au tableau de bord comptable</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email comptable</label>
              <input
                type="email"
                className="input"
                placeholder="comptable@fmcom.ma"
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
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-btn hover:bg-green-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Entrer dans le portail comptable'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Portail réservé aux comptables et auditeurs.
          </p>
        </div>
      </div>
    </div>
  )
}
