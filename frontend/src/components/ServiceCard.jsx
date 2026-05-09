import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const iconMap = {
  PaintBrushIcon:  '🎨',
  DevicePhoneMobileIcon: '📱',
  StarIcon:        '⭐',
  GlobeAltIcon:   '🌐',
  FilmIcon:        '🎬',
  MegaphoneIcon:   '📢',
  ChartBarIcon:    '📊',
  LightBulbIcon:   '💡',
}

export default function ServiceCard({ service }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleRequest = () => {
    if (user) {
      navigate(`/client/requests/new?service_id=${service.id}`)
    } else {
      navigate('/login', { state: { redirect: `/client/requests/new?service_id=${service.id}` } })
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card hover:shadow-hover transition-all duration-300 p-6 flex flex-col group relative overflow-hidden">
      {/* Badge */}
      <div className="absolute top-4 right-4">
        <span className="badge-devis">SUR DEVIS</span>
      </div>

      {/* Icon */}
      <div className="service-icon-wrap mb-4 w-14 h-14">
        <span className="text-2xl">{iconMap[service.icon] || '✨'}</span>
      </div>

      {/* Category */}
      {service.category && (
        <span className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
          {service.category}
        </span>
      )}

      {/* Name */}
      <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">
        {service.description}
      </p>

      {/* Action button */}
      <button
        onClick={handleRequest}
        className="mt-auto self-end w-10 h-10 bg-dark-nav text-white rounded-xl flex items-center justify-center hover:bg-primary transition-all duration-200 group-hover:scale-110"
        title="Demander ce service"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
