import { useState, useRef, useEffect } from 'react'
import { ExternalLink, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import StoreLogo from './StoreLogo'
import { useAuth } from '../contexts/AuthContext'

interface StoreBannerProps {
  storeName: string
  storeSlug: string
  storeLogo?: string
  storeIcon?: string
  showCustomization?: boolean
  onLogoClick?: () => void
}

export default function StoreBanner({ 
  storeName, 
  storeSlug, 
  storeLogo,
  storeIcon,
  showCustomization = false,
  onLogoClick
}: StoreBannerProps) {
  const { user, tenant, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Verificar si el usuario es propietario de esta tienda
  const isStoreOwner = isAuthenticated && tenant?.slug === storeSlug

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setShowDropdown(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleGoToPanel = () => {
    navigate('/panel')
    setShowDropdown(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo y info de la tienda */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (isStoreOwner) {
                    setShowDropdown(!showDropdown)
                  } else if (onLogoClick) {
                    onLogoClick()
                  }
                }}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
              >
                <StoreLogo 
                  logo={storeLogo}
                  icon={storeIcon}
                  storeName={storeName}
                  size="sm"
                />
                {isStoreOwner && (
                  <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Menú desplegable con animación */}
              {isStoreOwner && (
                <div
                  className={`absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transform transition-all duration-200 origin-top-left ${
                    showDropdown
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                  }`}
                  role="menu"
                  aria-hidden={!showDropdown}
                >
                  <div className="py-2">
                    <button
                      onClick={handleGoToPanel}
                      className="flex items-center w-full px-5 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      role="menuitem"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Ir al panel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-5 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {storeName}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                esdetienda.com/str/{storeSlug}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-2">
            {/* Toggle de tema - usando el componente que funciona */}
            <ThemeToggle />

            {/* Link a EsDeTienda */}
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">EsDeTienda</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
