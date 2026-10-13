const values = [
  { icon: '🎯', title: 'Mission',  desc: 'Aider les entreprises à réussir leur transformation digitale avec des solutions créatives et stratégiques adaptées à leurs objectifs.' },
  { icon: '🔭', title: 'Vision',   desc: 'Devenir l\'agence de référence en communication digitale au Maroc, reconnue pour son excellence et son innovation.' },
  { icon: '💎', title: 'Valeurs',  desc: 'Créativité, intégrité, excellence, réactivité et collaboration sont au cœur de chacune de nos actions.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark-nav text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold">À propos d’ENGINEERIUM</h1>
        <p className="text-gray-300 mt-3 max-w-xl mx-auto">
          Un bureau d’études dédié à la conception fiable et au suivi maîtrisé des projets de construction.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Story */}
        <div className="bg-white rounded-card shadow-card p-10 mb-10">
          <h2 className="text-3xl font-extrabold text-dark mb-4">Notre métier</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            ENGINEERIUM SARL accompagne les maîtres d’ouvrage, architectes et entreprises dans
            les études de bâtiments et d’ouvrages d’art, des avant-projets aux plans d’exécution.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mt-4">
            Notre approche associe analyse du besoin, dimensionnement, production documentaire,
            contrôle interne et coordination technique sur chantier.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {values.map(v => (
            <div key={v.title} className="bg-white rounded-card shadow-card p-8 text-center hover:shadow-hover transition-all">
              <div className="text-5xl mb-4">{v.icon}</div>
              <h3 className="text-xl font-bold text-dark mb-3">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="bg-white rounded-card shadow-card p-10 text-center">
          <h2 className="text-3xl font-extrabold text-dark mb-4">Notre équipe</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Une équipe multidisciplinaire passionnée : designers, développeurs, stratèges marketing,
            vidéastes et experts en communication. Ensemble, nous donnons vie à vos projets.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {[
              { role: 'Bâtiments', count: '01' },
              { role: 'Structures', count: '01' },
              { role: 'Exécution', count: '01' },
              { role: 'Chantier', count: '01' },
            ].map(t => (
              <div key={t.role} className="bg-primary-light rounded-2xl p-6">
                <p className="text-3xl font-extrabold text-primary">{t.count}</p>
                <p className="text-sm font-medium text-dark mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
