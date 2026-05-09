import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté avec succès')
    navigate('/')
  }

  const dashboardPath = user
    ? user.role === 'admin' ? '/admin' : user.role === 'accountant' ? '/accountant' : '/client'
    : '/login'

  return (
    <nav className="bg-dark-nav sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">F_MCOM</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/',        label: 'Accueil' },
              { to: '/services', label: 'Services' },
              { to: '/packs',   label: 'Packs' },
              { to: '/about',   label: 'À propos' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardPath}
                  className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-all"
                >
                  Mon espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-all"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {[
              { to: '/',        label: 'Accueil' },
              { to: '/services', label: 'Services' },
              { to: '/packs',   label: 'Packs' },
              { to: '/about',   label: 'À propos' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-primary font-semibold">
                    Mon espace
                  </Link>
                  <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-300 text-left">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-300">Connexion</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-white bg-primary rounded-lg text-center">Inscription</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
