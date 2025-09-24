import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Package,
  MessageCircle,
  Settings,
  Upload,
  ExternalLink,
  Plus,
  User,
  FileText,
  Menu,
  Home,
  Store,
  ShoppingCart,
  Users,
  Palette,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function DashboardPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(searchParams.get('welcome') === 'true')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const { user, tenant, logout } = useAuth()

  const mainNav = [
    { label: 'Resumen', to: '/panel', icon: Home, disabled: false, external: false, iconColor: 'text-blue-500', disabledColor: 'text-blue-300 dark:text-blue-400' },
    { label: 'Productos', to: '/panel/agregar-producto', icon: ShoppingCart, disabled: false, external: false, iconColor: 'text-emerald-500', disabledColor: 'text-emerald-300 dark:text-emerald-400' },
    { label: 'Pedidos', to: '#', icon: Package, disabled: true, external: false, iconColor: 'text-orange-500', disabledColor: 'text-orange-300 dark:text-orange-400' },
    { label: 'Clientes', to: '#', icon: Users, disabled: true, external: false, iconColor: 'text-purple-500', disabledColor: 'text-purple-300 dark:text-purple-400' },
    { label: 'Configuración', to: '#', icon: Settings, disabled: true, external: false, iconColor: 'text-gray-500', disabledColor: 'text-gray-300 dark:text-gray-400' },
    { label: 'Ver mi tienda', to: tenant ? `/str/${tenant.slug}` : '#', icon: Store, disabled: !tenant, external: true, iconColor: 'text-teal-500', disabledColor: 'text-teal-300 dark:text-teal-400' }
  ]

  const secondaryNav = [
    { label: 'Guía de inicio', to: '/panel/guia-importacion', icon: FileText, disabled: false, external: false, iconColor: 'text-indigo-500', disabledColor: 'text-indigo-300 dark:text-indigo-400' },
    { label: 'Personalizar', to: '#', icon: Palette, disabled: true, external: false, iconColor: 'text-pink-500', disabledColor: 'text-pink-300 dark:text-pink-400' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const stats = [
    { title: 'Productos', value: '0', icon: Package, change: '+0%' },
    { title: 'Consultas hoy', value: '0', icon: MessageCircle, change: '+0%' },
    { title: 'Visitas', value: '0', icon: BarChart3, change: '+0%' },
  ]

  useEffect(() => {
    if (showWelcome) {
      // Ocultar mensaje de bienvenida después de 5 segundos
      const timer = setTimeout(() => setShowWelcome(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  const isActive = (path: string) => {
    if (path === '#') return false
    if (path === '/panel' && location.pathname === '/panel') return true
    return location.pathname.startsWith(path) && path !== '/panel'
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
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
          <button
            className="lg:hidden text-gray-500 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
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
              Recursos
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
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.email}
              </p>
              {tenant && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tenant.business_name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 bg-background text-foreground transition-colors">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Abrir menú"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Panel de control</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tu tienda y productos</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
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
                <h2 className="text-lg font-semibold">
                  ¡Bienvenido a EsDeTienda! 🎉
                </h2>
                <p className="text-brand-100">
                  Configuraremos tu bot de WhatsApp en las próximas 24 horas. Mientras tanto, sube tus productos.
                </p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-brand-100 hover:text-white"
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center dark:bg-brand-500/20">
                    <stat.icon className="h-6 w-6 text-brand-500 dark:text-brand-200" />
                  </div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">{stat.change} vs ayer</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Productos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Catálogo de productos
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      to="/panel/agregar-producto"
                      className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Link>
                    <Link
                      to="/panel/guia-importacion"
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importar
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                    No tienes productos aún
                  </h4>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">
                    Sube tu primer producto o importa un catálogo completo desde CSV/Excel
                  </p>
                  <div className="space-y-2">
                    <Link
                      to="/panel/agregar-producto"
                      className="inline-block bg-brand-500 text-white px-6 py-2 rounded-xl hover:bg-brand-600 transition-colors"
                    >
                      Agregar producto
                    </Link>
                    <br />
                    <Link
                      to="/panel/guia-importacion"
                      className="text-brand-500 hover:text-brand-700 text-sm"
                    >
                      Ver guía de inicio →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configuración
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 text-brand-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">WhatsApp Bot</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pendiente configuración</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pendiente
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-brand-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Configuración general</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Datos del negocio, colores</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Función de configuración próximamente disponible')}
                      className="text-brand-500 hover:text-brand-700 text-sm"
                    >
                      Configurar
                    </button>
                  </div>

                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 dark:bg-brand-500/10 dark:border-brand-500/30">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-brand-500 rounded-full mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-brand-900 dark:text-brand-200">
                          Tu bot estará listo en 24 horas
                        </h4>
                        <p className="text-sm text-brand-700 mt-1 dark:text-brand-100">
                          Te enviaremos un email cuando esté configurado. Mientras tanto, sube tus productos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
