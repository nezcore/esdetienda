import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import posthog from 'posthog-js'

// Páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'

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
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Homepage y autenticación */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        
        {/* Panel de administración */}
        <Route path="/panel" element={<DashboardPage />} />
        <Route path="/panel/*" element={<DashboardPage />} />
        
        {/* Tiendas públicas multi-tenant */}
        <Route path="/:tenantSlug" element={<StorePage />} />
        <Route path="/:tenantSlug/producto/:productId" element={<ProductPage />} />
      </Routes>
    </div>
  )
}

export default App
