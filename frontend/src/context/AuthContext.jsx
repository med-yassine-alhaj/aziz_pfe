import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    const stored = localStorage.getItem('fmcom_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('fmcom_token')
    if (token) {
      authApi.me()
        .then(({ data }) => {
          setUser(data.user)
          localStorage.setItem('fmcom_user', JSON.stringify(data.user))
        })
        .catch(() => {
          localStorage.removeItem('fmcom_token')
          localStorage.removeItem('fmcom_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('fmcom_token', data.token)
    localStorage.setItem('fmcom_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const loginWithToken = useCallback((token, userData) => {
    localStorage.setItem('fmcom_token', token)
    localStorage.setItem('fmcom_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('fmcom_token', data.token)
    localStorage.setItem('fmcom_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('fmcom_token')
    localStorage.removeItem('fmcom_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('fmcom_user', JSON.stringify(userData))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
