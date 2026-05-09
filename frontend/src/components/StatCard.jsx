export default function StatCard({ label, value, icon, color = 'violet', trend }) {
  const colors = {
    violet: { icon: 'bg-primary-light text-primary', border: 'border-primary/20' },
    green:  { icon: 'bg-green-100 text-green-600',   border: 'border-green-200' },
    blue:   { icon: 'bg-blue-100 text-blue-600',     border: 'border-blue-200' },
    orange: { icon: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
    red:    { icon: 'bg-red-100 text-red-600',       border: 'border-red-200' },
  }
  const c = colors[color] || colors.violet

  return (
    <div className={`bg-white rounded-card shadow-card p-6 border ${c.border} hover:shadow-hover transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-dark mt-1">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
