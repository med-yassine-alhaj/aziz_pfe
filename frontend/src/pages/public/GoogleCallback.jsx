import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function GoogleCallback() {
  const [params]            = useSearchParams()
  const { loginWithToken }  = useAuth()
  const navigate            = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const role  = params.get('role')
    const error = params.get('error')

    if (error) {
      toast.error('Erreur lors de la connexion Google.')
      return navigate('/login')
    }

    if (token) {
      // Fetch user with the token
      localStorage.setItem('fmcom_token', token)
      api.get('/user').then(({ data }) => {
        loginWithToken(token, data.user)
        toast.success(`Bienvenue, ${data.user.name} !`)
        const redirects = { admin: '/admin/dashboard', accountant: '/accountant/dashboard', client: '/client/dashboard' }
        navigate(redirects[data.user.role] || '/client/dashboard', { replace: true })
      }).catch(() => {
        toast.error('Erreur d\'authentification.')
        navigate('/login')
      })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Connexion en cours...</p>
      </div>
    </div>
  )
}
