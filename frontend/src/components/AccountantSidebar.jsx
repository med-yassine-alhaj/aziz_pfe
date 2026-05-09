import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const links = [
  { to: '/accountant/dashboard', label: 'Tableau de bord', icon: '🏠' },
  { to: '/accountant/invoices',  label: 'Factures',        icon: '🧾' },
  { to: '/accountant/payments',  label: 'Paiements',       icon: '💳' },
  { to: '/accountant/reports',   label: 'Rapports',        icon: '📊' },
]

export default function AccountantSidebar() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté')
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-nav text-white flex flex-col z-40 hidden lg:flex">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-lg">F_MCOM</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Espace Comptable</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all">
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  )
}
