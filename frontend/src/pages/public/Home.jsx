import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ServiceCard from '../../components/ServiceCard'
import { servicesApi } from '../../api/servicesApi'
import { packsApi } from '../../api/packsApi'

const steps = [
  { n: '01', title: 'Soumettez votre projet', desc: 'Indiquez l’ouvrage, le site, la mission souhaitée et les documents disponibles.' },
  { n: '02', title: 'Analyse technique', desc: 'Nous précisons le périmètre, les livrables et le délai indicatif.' },
  { n: '03', title: 'Devis personnalisé', desc: 'Le prix est établi selon les caractéristiques réelles du projet, sans tarif inventé.' },
  { n: '04', title: 'Études et suivi', desc: 'Les documents sont produits, contrôlés et transmis avec un suivi des observations.' },
]

const reasons = [
  { icon: '🎯', title: 'Sur mesure',       desc: 'Chaque projet est unique. Nous adaptons notre approche à vos objectifs.' },
  { icon: '⚡', title: 'Réactivité',       desc: 'Réponse rapide, délais respectés, communication transparente.' },
  { icon: '🏆', title: 'Rigueur technique', desc: 'Des documents structurés et contrôlés avant transmission.' },
  { icon: '💎', title: 'Qualité premium',   desc: 'Des livrables qui reflètent l\'excellence et le professionnalisme.' },
]

export default function Home() {
  const [services, setServices] = useState([])
  const [packs, setPacks]       = useState([])

  useEffect(() => {
    servicesApi.getAll().then(({ data }) => setServices(data.data?.slice(0, 4) || data.slice?.(0, 4) || []))
    packsApi.getAll().then(({ data }) => setPacks(data.data || data || []))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="bg-dark-nav text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-nav via-dark-nav to-primary/20" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            ✨ Bureau d’études en bâtiments et ouvrages d’art
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Concevoir juste,<br />
            <span className="text-primary">construire durablement.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            ENGINEERIUM SARL accompagne les avant-projets, les études de structure, les plans
            d’exécution et la coordination technique sur chantier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/services" className="bg-primary text-white font-bold px-8 py-4 rounded-btn hover:bg-primary-dark transition-all text-lg">
              Découvrir nos prestations
            </Link>
            <Link to="/contact" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-btn hover:border-white transition-all text-lg">
              Soumettre un projet
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-devis mb-3 inline-block">Nos prestations</span>
            <h2 className="text-4xl font-extrabold text-dark">De l’étude au chantier</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Chaque mission est définie sur mesure selon les données et contraintes de l’ouvrage.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary inline-flex">
              Voir toutes les prestations
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge-devis mb-3 inline-block">Comment ça marche</span>
            <h2 className="text-4xl font-extrabold text-dark">Étapes de travail</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(s => (
              <div key={s.n} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 bg-primary-light text-primary font-extrabold text-xl rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {s.n}
                </div>
                <h3 className="font-bold text-dark mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKS */}
      {packs.length > 0 && (
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge-devis mb-3 inline-block">Missions d’études</span>
              <h2 className="text-4xl font-extrabold text-dark">Des périmètres clairs</h2>
              <p className="text-gray-500 mt-3">Livrables, pièces nécessaires et délais indicatifs sont précisés dans chaque proposition.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packs.map((pack, i) => (
                <div key={pack.id} className={`bg-white rounded-card shadow-card p-8 flex flex-col ${i === 1 ? 'border-2 border-primary shadow-hover' : ''}`}>
                  {i === 1 && <span className="self-start badge-devis mb-4">Populaire</span>}
                  <h3 className="text-2xl font-extrabold text-dark mb-2">{pack.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1">{pack.description}</p>
                  <ul className="space-y-2 mb-8">
                    {pack.services?.map(s => (
                      <li key={s.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-primary">✓</span> {s.name}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`text-center py-3 rounded-btn font-bold text-sm transition-all ${i === 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'border-2 border-dark-nav text-dark-nav hover:bg-dark-nav hover:text-white'}`}>
                    Demander un devis
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* POURQUOI NOUS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-devis mb-3 inline-block">Pourquoi nous</span>
            <h2 className="text-4xl font-extrabold text-dark">Notre différence</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map(r => (
              <div key={r.title} className="bg-surface rounded-card p-6 text-center hover:shadow-card transition-all">
                <div className="text-4xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-dark mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-dark-nav text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un devis personnalisé. Sans engagement.</p>
          <Link to="/contact" className="bg-primary text-white font-bold px-10 py-4 rounded-btn hover:bg-primary-dark transition-all text-lg inline-block">
            Soumettre un projet
          </Link>
        </div>
      </section>
    </div>
  )
}
