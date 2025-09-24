import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { Home, Users, Store, Database, LogOut, BarChart3, Shield } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { useState } from 'react'

export default function AdminDashboardLayout() {
  const { admin, logout } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const isActive = (path: string) => location.pathname === path

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`group flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
        isActive(to)
          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-100'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/60'
      }`}
    >
      <Icon className="h-5 w-5 mr-3 text-sky-500" />
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} dark:bg-gray-900 dark:border-gray-800`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-500" />
            <span className="text-lg font-bold bg-brand-gradient bg-clip-text text-transparent">Superadmin</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto py-6 px-4 space-y-6">
          <div>
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mb-3">Principal</p>
            <nav className="space-y-2">
              <NavItem to="/superadmin" icon={Home} label="Resumen" />
              <NavItem to="/superadmin/tenants" icon={Store} label="Tiendas" />
              <NavItem to="/superadmin/users" icon={Users} label="Usuarios" />
              <NavItem to="/superadmin/stats" icon={BarChart3} label="Estadísticas" />
              <NavItem to="/superadmin/recursos" icon={Database} label="Recursos" />
            </nav>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center gap-3 px-4">
              <div className="h-9 w-9 rounded-full bg-brand-500 text-white grid place-items-center">{admin?.email?.[0]?.toUpperCase() ?? 'A'}</div>
              <div>
                <p className="text-sm font-semibold">{admin?.email}</p>
                <p className="text-xs text-gray-500">Superadmin</p>
              </div>
            </div>
            <div className="mt-4 px-4">
              <button onClick={() => { logout(); navigate('/superadmin/acceso') }} className="w-full flex items-center justify-center gap-2 py-2 text-sm bg-gradient-to-l from-red-400 to-red-500 text-white rounded-lg">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      <button className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg text-gray-600 dark:text-gray-300 p-2 transition-all ${isSidebarOpen ? 'left-64' : 'left-0'} rounded-r-lg`} onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}>
        {isSidebarOpen ? '<' : '>'}
      </button>

      <div className={`flex-1 flex flex-col min-h-screen bg-background text-foreground transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold">Panel Superadmin</h1>
              <p className="text-xs sm:text-sm text-gray-500">Control total de la plataforma</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


