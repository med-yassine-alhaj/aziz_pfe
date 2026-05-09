import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { packsApi } from '../../api/packsApi'

export default function Packs() {
  const [packs, setPacks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    packsApi.getAll()
      .then(({ data }) => setPacks(data.data || data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark-nav text-white py-16 px-4 text-center">
        <span className="badge-devis mb-4 inline-block">Offres groupées</span>
        <h1 className="text-4xl font-extrabold">Nos Packs</h1>
        <p className="text-gray-300 mt-3 max-w-xl mx-auto">
          Des solutions complètes adaptées à chaque étape de votre développement. Tous sur devis.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packs.map((pack, i) => (
              <div
                key={pack.id}
                className={`bg-white rounded-card shadow-card p-8 flex flex-col hover:shadow-hover transition-all ${
                  i === 1 ? 'border-2 border-primary ring-1 ring-primary/20' : ''
                }`}
              >
                {i === 1 && (
                  <span className="self-start bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    ⭐ Recommandé
                  </span>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-dark">{pack.name}</h2>
                  <p className="text-gray-500 text-sm mt-2">{pack.description}</p>
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Services inclus
                  </h4>
                  <ul className="space-y-3">
                    {pack.services?.map(s => (
                      <li key={s.id} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary font-bold mt-0.5">✓</span>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <div className="bg-primary-light rounded-xl p-4 text-center mb-4">
                    <p className="text-xs text-primary font-medium">Prix</p>
                    <p className="text-xl font-extrabold text-primary">{pack.badge_label}</p>
                  </div>
                  <Link
                    to="/contact"
                    className={`block text-center py-3 rounded-btn font-bold text-sm transition-all ${
                      i === 1
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'border-2 border-dark-nav text-dark-nav hover:bg-dark-nav hover:text-white'
                    }`}
                  >
                    Demander un devis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
