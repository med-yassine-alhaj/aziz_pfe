import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate send (no backend endpoint for public contact, extend if needed)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message envoyé ! Nous vous répondrons très bientôt.')
    reset()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark-nav text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold">Contactez-nous</h1>
        <p className="text-gray-300 mt-3">Nous sommes disponibles pour répondre à toutes vos questions.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-extrabold text-dark mb-6">Nos coordonnées</h2>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email',    val: 'contact@fmcom.ma' },
                { icon: '📞', label: 'Téléphone', val: '+212 5XX-XXXXXX' },
                { icon: '📍', label: 'Adresse',   val: 'Casablanca, Maroc' },
                { icon: '🕐', label: 'Horaires',  val: 'Lun — Ven : 9h — 18h' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                    <p className="text-dark font-semibold">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-primary-light rounded-2xl p-6">
              <h3 className="font-bold text-primary mb-2">Réseaux sociaux</h3>
              <div className="flex gap-3">
                {['Instagram', 'LinkedIn', 'Facebook'].map(r => (
                  <span key={r} className="bg-white text-sm text-dark font-medium px-4 py-2 rounded-xl shadow-sm">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-card shadow-card p-8">
            <h2 className="text-2xl font-extrabold text-dark mb-6">Envoyez un message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                  <input className="input" {...register('name', { required: 'Requis' })} placeholder="Votre nom" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                  <input type="email" className="input" {...register('email', { required: 'Requis' })} placeholder="email@exemple.ma" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Sujet *</label>
                <input className="input" {...register('subject', { required: 'Requis' })} placeholder="De quoi s'agit-il ?" />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Message *</label>
                <textarea
                  className="input resize-none"
                  rows={5}
                  placeholder="Décrivez votre projet ou votre question..."
                  {...register('message', { required: 'Requis', minLength: { value: 20, message: 'Minimum 20 caractères' } })}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-nav text-white font-bold py-3 rounded-btn hover:bg-primary transition-all disabled:opacity-60"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
