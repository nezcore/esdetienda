import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import posthog from 'posthog-js'

// Contextos
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'

// Componentes
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardLayout from './pages/AdminDashboardLayout'
import AdminDashboardHome from './pages/AdminDashboardHome'
import AdminTenantsPage from './pages/AdminTenantsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import ProductsListPage from './pages/ProductsListPage'
import ResourcesPage from './pages/ResourcesPage'

// Páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductPage from './pages/ProductPage'
import TermsPage from './pages/TermsPage'
import AddProductPage from './pages/AddProductPage'
import PublicStorePage from './pages/PublicStorePage'
import ImportGuidePage from './pages/ImportGuidePage'

function App() {
  useEffect(() => {
    // Configurar PostHog
    if (import.meta.env.VITE_POSTHOG_API_KEY) {
      posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        loaded: (posthog) => {
          if (import.meta.env.DEV) posthog.debug() // debug mode en desarrollo
        }
      })
    }
  }, [])

  return (
    <ThemeProvider>
      <AdminAuthProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Routes>
            {/* Homepage y autenticación */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            
            {/* Panel de administración - PROTEGIDO */}
            <Route 
              path="/panel" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<DashboardHome />} />
              <Route path="productos" element={<ProductsListPage />} />
              <Route path="recursos" element={<ResourcesPage />} />
              <Route path="agregar-producto" element={<AddProductPage />} />
              <Route path="guia-importacion" element={<ImportGuidePage />} />
            </Route>
            
            {/* Tiendas públicas multi-tenant */}
            <Route path="/str/:tenantSlug" element={<PublicStorePage />} />
            <Route path="/str/:tenantSlug/producto/:productId" element={<ProductPage />} />
            {/* Superadmin */}
            <Route path="/superadmin/acceso" element={<AdminLoginPage />} />
            <Route 
              path="/superadmin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardHome />} />
              <Route path="tenants" element={<AdminTenantsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  )
}

export default App
