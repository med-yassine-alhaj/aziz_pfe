import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import AccountantLayout from './layouts/AccountantLayout'

// Public pages
import Home from './pages/public/Home'
import Services from './pages/public/Services'
import Packs from './pages/public/Packs'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import GoogleCallback from './pages/public/GoogleCallback'
import AdminLogin from './pages/admin/AdminLogin'
import AccountantLogin from './pages/accountant/AccountantLogin'

// Client pages
import ClientDashboard from './pages/client/ClientDashboard'
import ClientRequests from './pages/client/ClientRequests'
import NewRequest from './pages/client/NewRequest'
import ClientQuotes from './pages/client/ClientQuotes'
import QuoteDetails from './pages/client/QuoteDetails'
import ClientInvoices from './pages/client/ClientInvoices'
import InvoiceDetails from './pages/client/InvoiceDetails'
import PaymentPage from './pages/client/PaymentPage'
import ClientChat from './pages/client/ClientChat'
import ClientProfile from './pages/client/ClientProfile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminServices from './pages/admin/AdminServices'
import AdminPacks from './pages/admin/AdminPacks'
import AdminRequests from './pages/admin/AdminRequests'
import AdminRequestDetails from './pages/admin/AdminRequestDetails'
import AdminQuotes from './pages/admin/AdminQuotes'
import CreateQuote from './pages/admin/CreateQuote'
import AdminInvoices from './pages/admin/AdminInvoices'
import AdminClients from './pages/admin/AdminClients'
import AdminChat from './pages/admin/AdminChat'
import AdminSettings from './pages/admin/AdminSettings'

// Accountant pages
import AccountantDashboard from './pages/accountant/AccountantDashboard'
import AccountantInvoices from './pages/accountant/AccountantInvoices'
import AccountantInvoiceDetails from './pages/accountant/AccountantInvoiceDetails'
import AccountantPayments from './pages/accountant/AccountantPayments'
import AccountantReports from './pages/accountant/AccountantReports'

export default function App() {
  const isAdminPortal = import.meta.env.VITE_APP_PORTAL === 'admin'

  if (isAdminPortal) {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/accountant/login" element={<AccountantLogin />} />

          <Route path="admin" element={<ProtectedRoute role="admin" loginPath="/admin/login"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="packs" element={<AdminPacks />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<AdminRequestDetails />} />
            <Route path="requests/:id/chat" element={<AdminChat />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="quotes/create" element={<CreateQuote />} />
            <Route path="quotes/:id/edit" element={<CreateQuote />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="accountant" element={<ProtectedRoute role="accountant" loginPath="/accountant/login"><AccountantLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AccountantDashboard />} />
            <Route path="invoices" element={<AccountantInvoices />} />
            <Route path="invoices/:id" element={<AccountantInvoiceDetails />} />
            <Route path="payments" element={<AccountantPayments />} />
            <Route path="reports" element={<AccountantReports />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="packs" element={<Packs />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<GoogleCallback />} />
        </Route>

        {/* CLIENT */}
        <Route path="client" element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="requests" element={<ClientRequests />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="requests/:id/chat" element={<ClientChat />} />
          <Route path="quotes" element={<ClientQuotes />} />
          <Route path="quotes/:id" element={<QuoteDetails />} />
          <Route path="invoices" element={<ClientInvoices />} />
          <Route path="invoices/:id" element={<InvoiceDetails />} />
          <Route path="invoices/:id/pay" element={<PaymentPage />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* ADMIN */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<ProtectedRoute role="admin" loginPath="/admin/login"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="packs" element={<AdminPacks />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="requests/:id" element={<AdminRequestDetails />} />
          <Route path="requests/:id/chat" element={<AdminChat />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="quotes/create" element={<CreateQuote />} />
          <Route path="quotes/:id/edit" element={<CreateQuote />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ACCOUNTANT */}
        <Route path="accountant/login" element={<AccountantLogin />} />
        <Route path="accountant" element={<ProtectedRoute role="accountant" loginPath="/accountant/login"><AccountantLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AccountantDashboard />} />
          <Route path="invoices" element={<AccountantInvoices />} />
          <Route path="invoices/:id" element={<AccountantInvoiceDetails />} />
          <Route path="payments" element={<AccountantPayments />} />
          <Route path="reports" element={<AccountantReports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
