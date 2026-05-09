import { useState, useEffect } from 'react'
import ServiceCard from '../../components/ServiceCard'
import { servicesApi } from '../../api/servicesApi'

export default function Services() {
  const [services, setServices]   = useState([])
  const [category, setCategory]   = useState('Tous')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    servicesApi.getAll()
      .then(({ data }) => setServices(data.data || data))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['Tous', ...new Set(services.map(s => s.category).filter(Boolean))]
  const filtered = category === 'Tous' ? services : services.filter(s => s.category === category)

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-dark-nav text-white py-16 px-4 text-center">
        <span className="badge-devis mb-4 inline-block">Tous sur devis</span>
        <h1 className="text-4xl font-extrabold">Nos Services</h1>
        <p className="text-gray-300 mt-3 max-w-xl mx-auto">
          Chaque service est personnalisé selon vos besoins. Pas de prix fixe, des solutions sur mesure.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-primary-light hover:text-primary border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
