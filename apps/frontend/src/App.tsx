import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import posthog from 'posthog-js'

// Contextos
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

// Componentes
import ProtectedRoute from './components/ProtectedRoute'

// Páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import TermsPage from './pages/TermsPage'

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
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/panel/*" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Tiendas públicas multi-tenant */}
            <Route path="/str/:tenantSlug" element={<StorePage />} />
            <Route path="/str/:tenantSlug/producto/:productId" element={<ProductPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
