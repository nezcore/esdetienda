import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link, useLocation, Outlet } from 'react-router-dom'
import {
  Package,
  Settings,
  ExternalLink,
  FileText,
  Menu,
  Home,
  Store,
  ShoppingCart,
  Users,
  Palette,
  Gauge,
  Rocket,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import PlanModal from './PlanModal'

export default function DashboardLayout() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(searchParams.get('welcome') === 'true')
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('sidebar_open')
    if (stored !== null) return stored === 'true'
    // Por defecto: abierto en desktop, cerrado en móvil
    return window.innerWidth >= 1024
  })
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user, tenant, logout } = useAuth()

  const mainNav = [
    { label: 'Resumen', to: '/panel', icon: Home, disabled: false, external: false, iconColor: 'text-blue-500', disabledColor: 'text-blue-300 dark:text-blue-400' },
    { label: 'Productos', to: '/panel/productos', icon: ShoppingCart, disabled: false, external: false, iconColor: 'text-emerald-500', disabledColor: 'text-emerald-300 dark:text-emerald-400' },
    { label: 'Pedidos', to: '#', icon: Package, disabled: true, external: false, iconColor: 'text-orange-500', disabledColor: 'text-orange-300 dark:text-orange-400' },
    { label: 'Clientes', to: '#', icon: Users, disabled: true, external: false, iconColor: 'text-purple-500', disabledColor: 'text-purple-300 dark:text-purple-400' },
    { label: 'Ver mi tienda', to: tenant ? `/str/${tenant.slug}` : '#', icon: Store, disabled: !tenant, external: true, iconColor: 'text-teal-500', disabledColor: 'text-teal-300 dark:text-teal-400' }
  ]

  const secondaryNav = [
    { label: 'Personalización', to: '/panel/personalizacion', icon: Palette, disabled: false, external: false, iconColor: 'text-pink-500', disabledColor: 'text-pink-300 dark:text-pink-400' },
    { label: 'Configuración', to: '/panel/configuracion', icon: Settings, disabled: false, external: false, iconColor: 'text-gray-500', disabledColor: 'text-gray-300 dark:text-gray-400' },
    { label: 'Recursos', to: '/panel/recursos', icon: Gauge, disabled: false, external: false, iconColor: 'text-sky-500', disabledColor: 'text-sky-300 dark:text-sky-400' },
    { label: 'Guía de inicio', to: '/panel/guia-importacion', icon: FileText, disabled: false, external: false, iconColor: 'text-indigo-500', disabledColor: 'text-indigo-300 dark:text-indigo-400' }
  ]

  const planStyles: Record<string, { label: string; badgeClass: string; textClass: string }> = {
    esencial: {
      label: 'Starter',
      badgeClass: 'bg-gradient-to-r from-emerald-500/15 to-emerald-400/20 border border-emerald-400/40',
      textClass: 'text-emerald-700 dark:text-emerald-200'
    },
    grow: {
      label: 'Grow',
      badgeClass: 'bg-gradient-to-r from-blue-500/15 to-slate-500/20 border border-blue-400/40',
      textClass: 'text-blue-700 dark:text-blue-200'
    },
    pro: {
      label: 'Pro',
      badgeClass: 'bg-gradient-to-r from-orange-500/15 to-red-500/20 border border-orange-400/40',
      textClass: 'text-orange-700 dark:text-orange-200'
    },
    default: {
      label: 'Plan sin asignar',
      badgeClass: 'bg-gray-200/50 border border-gray-300/60 dark:bg-gray-700/40 dark:border-gray-600/60',
      textClass: 'text-gray-700 dark:text-gray-200'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    if (showWelcome) {
      // Ocultar mensaje de bienvenida después de 5 segundos
      const timer = setTimeout(() => setShowWelcome(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const unlock = () => {
      document.body.style.removeProperty('overflow')
    }

    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
      return () => unlock()
    }

    unlock()
    return undefined
  }, [isSidebarOpen])

  // Persistir preferencia del sidebar
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('sidebar_open', String(isSidebarOpen))
    } catch {}
  }, [isSidebarOpen])

  const isActive = (path: string) => {
    if (path === '#') return false
    if (path === '/panel' && location.pathname === '/panel') return true
    return location.pathname.startsWith(path) && path !== '/panel'
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } dark:bg-gray-900 dark:border-gray-800`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold bg-brand-gradient bg-clip-text text-transparent dark:text-white">
                EsDeTienda
              </span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-700 dark:bg-gray-800 dark:text-brand-300">
              Panel
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto py-6 px-4 space-y-8">
          <nav className="space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mb-4">
              Principal
            </p>
            {mainNav.map((item) => {
              const Icon = item.icon
              const isExternal = Boolean(item.external)
              const isDisabled = Boolean(item.disabled)
              const active = item.to !== '#' && !isExternal && isActive(item.to)
              const commonClasses = 'group flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 mb-1'

              if (isDisabled) {
                return (
                  <button
                    key={item.label}
                    className={`${commonClasses} text-gray-400 cursor-not-allowed dark:text-gray-600`}
                    disabled
                  >
                    <Icon className={`h-6 w-6 mr-3 ${item.disabledColor}`} />
                    {item.label}
                  </button>
                )
              }

              if (isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${commonClasses} text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:hover:text-white hover:scale-[1.02] hover:shadow-sm`}
                  >
                    <Icon className={`h-6 w-6 mr-3 ${item.iconColor} group-hover:scale-110 transition-transform duration-200`} />
                    {item.label}
                    <ExternalLink className="h-4 w-4 ml-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  </a>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`${commonClasses} ${
                    active
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 border border-blue-300 shadow-lg ring-1 ring-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-700/50 dark:text-blue-100 dark:shadow-blue-500/10 dark:ring-0'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:hover:text-white hover:scale-[1.02] hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 mr-3 transition-all duration-200 ${
                      active
                        ? `${item.iconColor} scale-110 drop-shadow-sm`
                        : `${item.iconColor} group-hover:scale-110`
                    }`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <nav className="space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mb-4">
              Sistema
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon
              const isExternal = Boolean(item.external)
              const isDisabled = Boolean(item.disabled)
              const active = item.to !== '#' && !isExternal && isActive(item.to)
              const commonClasses = 'group flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 mb-1'

              if (isDisabled) {
                return (
                  <button
                    key={item.label}
                    className={`${commonClasses} text-gray-400 cursor-not-allowed dark:text-gray-600`}
                    disabled
                  >
                    <Icon className={`h-6 w-6 mr-3 ${item.disabledColor}`} />
                    {item.label}
                  </button>
                )
              }

              if (isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${commonClasses} text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:hover:text-white hover:scale-[1.02] hover:shadow-sm`}
                  >
                    <Icon className={`h-6 w-6 mr-3 ${item.iconColor} group-hover:scale-110 transition-transform duration-200`} />
                    {item.label}
                    <ExternalLink className="h-4 w-4 ml-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
                  </a>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`${commonClasses} ${
                    active
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 border border-blue-300 shadow-lg ring-1 ring-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-700/50 dark:text-blue-100 dark:shadow-blue-500/10 dark:ring-0'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:hover:text-white hover:scale-[1.02] hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 mr-3 transition-all duration-200 ${
                      active
                        ? `${item.iconColor} scale-110 drop-shadow-sm`
                        : `${item.iconColor} group-hover:scale-110`
                    }`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 ml-3 relative">
              {tenant && (
                <button
                  onClick={() => setIsPlanModalOpen(true)}
                  className={`absolute -top-2 right-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 active:scale-95 ${(planStyles[tenant.plan]?.badgeClass ?? planStyles.default.badgeClass)} ${(planStyles[tenant.plan]?.textClass ?? planStyles.default.textClass)}`}
                  title="Ver detalles del plan"
                >
                  {planStyles[tenant.plan]?.label ?? planStyles.default.label}
                </button>
              )}
              <p className="text-sm font-semibold text-gray-900 dark:text-white pr-16">
                {user?.email}
              </p>
              {tenant && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tenant.business_name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="mx-auto max-w-40 w-full bg-gradient-to-l from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-red-400/15 flex items-center justify-center gap-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button - Floating next to sidebar */}
      <button
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 transition-all duration-300 hover:scale-110 ${
          isSidebarOpen ? 'left-64 rounded-r-lg md:rounded-r-lg' : 'left-0 rounded-r-full'
        } md:block`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
      >
        {isSidebarOpen ? (
          <X className="h-3.5 w-3.5" />
        ) : (
          <Menu className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Overlay - only on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={`flex-1 flex flex-col min-h-screen bg-background text-foreground transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} ${
        isSidebarOpen ? 'lg:overflow-y-visible overflow-y-hidden' : 'overflow-y-visible'
      }`}>
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-lg">Panel de control</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-sm text-xs">Gestiona tu tienda<span className="hidden sm:inline"> y productos</span></p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {tenant?.plan === 'esencial' && (
                  <button
                    onClick={() => navigate('/panel/recursos')}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/85 via-teal-500/85 to-sky-500/85 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 transition-transform hover:scale-[1.03] hover:shadow-emerald-500/35 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:from-emerald-500/70 dark:via-teal-500/70 dark:to-sky-500/70 dark:text-white"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mejora tu plan</span>
                    <span className="sm:hidden">Mejorar</span>
                  </button>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-brand-gradient text-white">
            <div className="px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold drop-shadow-sm">
                  ¡Bienvenido a EsDeTienda! 🎉
                </h2>
                <p className="text-white/90 dark:text-white font-medium drop-shadow-sm">
                  Configuraremos tu bot de WhatsApp en las próximas 24 horas. Mientras tanto, sube tus productos.
                </p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-white/80 hover:text-white"
                  aria-label="Cerrar mensaje de bienvenida"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Main content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 bg-background text-foreground transition-colors">
          <Outlet />
        </main>
      </div>

      {/* Plan Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        tenant={tenant}
      />
    </div>
  )
}
