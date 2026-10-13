import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'

export default function EngineerLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />
      <main className="max-w-6xl mx-auto p-6 lg:p-8"><Outlet /></main>
    </div>
  )
}
