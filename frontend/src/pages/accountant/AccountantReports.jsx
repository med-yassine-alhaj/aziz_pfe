import { useState, useEffect } from 'react'
import { reportsApi } from '../../api/reportsApi'
import { invoicesApi } from '../../api/invoicesApi'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import toast from 'react-hot-toast'

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatMAD(value) {
  return `${Number(value).toLocaleString('fr-MA')} MAD`
}

export default function AccountantReports() {
  const [year, setYear]           = useState(new Date().getFullYear())
  const [revenue, setRevenue]     = useState([])
  const [clients, setClients]     = useState([])
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([
      reportsApi.revenue({ year }),
      reportsApi.clientRevenue(),
      reportsApi.serviceRevenue(),
    ])
      .then(([r, c, s]) => {
        const raw = r.data.data ?? r.data
        const monthly = Array.from({ length: 12 }, (_, i) => {
          const found = (Array.isArray(raw) ? raw : []).find(d => Number(d.month) === i + 1)
          return {
            name: MONTHS_FR[i],
            Revenus: Number(found?.total ?? 0),
            Factures: Number(found?.count ?? 0),
          }
        })
        setRevenue(monthly)
        setClients(c.data.data ?? c.data)
        setServices(s.data.data ?? s.data)
      })
      .catch(() => toast.error('Erreur chargement rapports.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [year])

  const exportCsv = async () => {
    try {
      const { data } = await invoicesApi.accountantExport()
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
      const a = document.createElement('a'); a.href = url; a.download = `rapport-${year}.csv`; a.click()
      URL.revokeObjectURL(url)
      toast.success('Export téléchargé.')
    } catch { toast.error('Erreur export.') }
  }

  const totalRevenue = revenue.reduce((acc, m) => acc + m.Revenus, 0)
  const totalInvoices = revenue.reduce((acc, m) => acc + m.Factures, 0)

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Rapports financiers</h1>
          <p className="text-sm text-gray-400 mt-1">Vue d'ensemble des revenus et performances</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input w-auto" value={year} onChange={e => setYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={exportCsv} className="btn-outline flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-400 mb-1">Revenus {year}</p>
          <p className="text-2xl font-bold text-dark">{totalRevenue.toLocaleString('fr-MA')} MAD</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-400 mb-1">Factures payées</p>
          <p className="text-2xl font-bold text-dark">{totalInvoices}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-400 mb-1">Panier moyen</p>
          <p className="text-2xl font-bold text-dark">{totalInvoices ? Math.round(totalRevenue / totalInvoices).toLocaleString('fr-MA') : 0} MAD</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Revenue chart */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-5">Revenus mensuels {year}</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F5" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toLocaleString('fr-MA')}`} />
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString('fr-MA')} MAD`, 'Revenus']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="Revenus" stroke="#7C3AED" strokeWidth={2} fill="url(#colorRev)" dot={{ r: 4, fill: '#7C3AED' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Client revenue table */}
          {clients.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-dark">Revenus par client</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-gray-400 font-medium">Client</th>
                    <th className="text-center px-5 py-3 text-gray-400 font-medium">Factures</th>
                    <th className="text-right px-5 py-3 text-gray-400 font-medium">Revenus</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c, i) => (
                    <tr key={c.id ?? i} className="table-row">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar_url} className="w-8 h-8 rounded-full" alt="" />
                          <div>
                            <p className="font-medium text-dark">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600">{c.invoices_count ?? 0}</td>
                      <td className="px-5 py-4 text-right font-bold text-dark">{Number(c.total_revenue ?? 0).toLocaleString('fr-MA')} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Service revenue chart */}
          {services.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-dark mb-5">Revenus par service</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={services} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F0F5" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toLocaleString('fr-MA')}`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#374151', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip formatter={(v) => [`${Number(v).toLocaleString('fr-MA')} MAD`, 'Revenus']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="total_revenue" fill="#7C3AED" radius={[0, 6, 6, 0]} name="Revenus" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
