import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark-nav text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-white font-bold text-xl">F_MCOM</span>
            </div>
            <p className="text-sm leading-relaxed">
              Votre partenaire en communication digitale. Créativité, stratégie et excellence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-primary transition-colors">Graphic Design</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">UI/UX Design</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Site Web</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Stratégie Marketing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/"        className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/packs"   className="hover:text-primary transition-colors">Packs</Link></li>
              <li><Link to="/about"   className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 contact@fmcom.ma</li>
              <li>📞 +212 5XX-XXXXXX</li>
              <li>📍 Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} F_MCOM. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">Sur devis</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
