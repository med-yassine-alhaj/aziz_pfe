import { Outlet } from 'react-router-dom'
import AccountantSidebar from '../components/AccountantSidebar'
import DashboardHeader from '../components/DashboardHeader'

export default function AccountantLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AccountantSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
