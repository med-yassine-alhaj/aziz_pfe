import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

const initialToken = localStorage.getItem('engineerium_token')
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('engineerium_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.endsWith('/login')
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('engineerium_token')
      localStorage.removeItem('engineerium_user')
      const isAdmin = window.location.pathname.startsWith('/admin')
      window.location.href = isAdmin ? '/admin/login' : '/login'
    }
    return Promise.reject(err)
  }
)

export default api
