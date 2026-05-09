import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif]         = useState(false)
  const [unread, setUnread]               = useState(0)

  useEffect(() => {
    api.get('/notifications').then(({ data }) => {
      setNotifications(data.slice(0, 8))
      setUnread(data.filter(n => !n.is_read).length)
    }).catch(() => {})
  }, [])

  const markAllRead = () => {
    api.post('/notifications/read-all').then(() => {
      setUnread(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    })
    setShowNotif(false)
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Bienvenue,</p>
        <h2 className="font-bold text-dark">{user?.name}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-10 h-10 bg-surface rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-card shadow-2xl border border-gray-100 z-50">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 className="font-semibold text-sm text-dark">Notifications</h4>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Aucune notification</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-surface transition-colors ${!n.is_read ? 'bg-primary-light/30' : ''}`}>
                      <p className="text-sm font-medium text-dark">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&color=7C3AED&background=F1EAFE`}
            alt={user?.name}
            className="w-9 h-9 rounded-xl object-cover border-2 border-primary-light"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-dark leading-none">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
