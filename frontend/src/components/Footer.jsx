import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark-nav text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/engineerium-logo.png" alt="ENGINEERIUM" className="w-10 h-10 object-contain" />
              <span className="text-white font-bold text-xl">ENGINEERIUM SARL</span>
            </div>
            <p className="text-sm leading-relaxed">
              Bureau d’études spécialisé dans les bâtiments, les ouvrages d’art et l’accompagnement technique des chantiers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Prestations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-primary transition-colors">Études de structure</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Plans d’exécution</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Ouvrages d’art</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Suivi de chantier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/"        className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/packs"   className="hover:text-primary transition-colors">Missions d’études</Link></li>
              <li><Link to="/about"   className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 fradi.hichem@gmail.com</li>
              <li>📞 +216 71 766 100</li>
              <li>📍 Appartement D2, résidence La Tulipe, Centre urbain nord, 1082 Tunis</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ENGINEERIUM SARL. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">Sur devis</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
