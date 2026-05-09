import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Ensure Authorization header is available immediately when the module loads
const initialToken = localStorage.getItem('fmcom_token')
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fmcom_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fmcom_token')
      localStorage.removeItem('fmcom_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
