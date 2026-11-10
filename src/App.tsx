import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '~/global/providers/theme-provider'
import { ConfirmationProvider } from '~/global/providers/confirmation'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import PageLoader from './components/ui/PageLoader'
import Staff from './pages/Staff'
import Drivers from './pages/Drivers'
import Clients from './pages/Clients'
import Vendors from './pages/Vendors'
import Bookings from './pages/Bookings'
import Tracking from './pages/Tracking'
import TrackingStatuses from './pages/TrackingStatuses'
import Expenses from './pages/Expenses'
import Invoices from './pages/Invoices'
import Assets from './pages/Assets'
import Trips from './pages/Trips'
import Reports from './pages/Reports'
import Reconciliation from './pages/Reconciliation'
import Profile from './pages/Profile'

// Loaded on demand so the kit's chart/demo code stays out of the main bundle.
const ComponentsPlayground = lazy(() => import('~/pages/components-playground'))





function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/components/playground"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ComponentsPlayground />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="/components-playground" element={<Navigate to="/components/playground" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
<Route path="/bookings" element={<Bookings />} />
<Route path="/trips" element={<Trips />} />
<Route path="/tracking" element={<Tracking />} />
<Route path="/tracking/statuses" element={<TrackingStatuses />} />
<Route path="/assets" element={<Assets />} />
<Route path="/staff" element={<Staff />} />
<Route path="/drivers" element={<Drivers />} />
<Route path="/clients" element={<Clients />} />
<Route path="/vendors" element={<Vendors />} />
<Route path="/expenses" element={<Expenses />} />
<Route path="/invoices" element={<Invoices />} />
<Route path="/users" element={<Users />} />
<Route path="/reports" element={<Reports />} />
<Route path="/reconciliation" element={<Reconciliation />} />
<Route path="/profile" element={<Profile />} />

      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ConfirmationProvider>
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}

export default App
