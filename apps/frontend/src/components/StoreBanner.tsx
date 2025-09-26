import { useState } from 'react'
import { ExternalLink, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import StoreLogo from './StoreLogo'

interface StoreBannerProps {
  storeName: string
  storeSlug: string
  storeLogo?: string
  storeIcon?: string
  showCustomization?: boolean
  onCustomizationClick?: () => void
  onLogoClick?: () => void
}

export default function StoreBanner({ 
  storeName, 
  storeSlug, 
  storeLogo,
  storeIcon,
  showCustomization = false,
  onCustomizationClick,
  onLogoClick
}: StoreBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo y info de la tienda */}
          <div className="flex items-center space-x-3">
            <StoreLogo 
              logo={storeLogo}
              icon={storeIcon}
              storeName={storeName}
              size="sm"
              onClick={onLogoClick}
            />
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

            {/* Botón de personalización (solo para propietarios) */}
            {showCustomization && (
              <button
                onClick={onCustomizationClick}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="Personalizar tienda"
              >
                <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </button>
            )}

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

      {/* Barra de personalización expandible */}
      {showCustomization && isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white/98 dark:bg-gray-900/98">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Personalización rápida:
                </span>
                <div className="flex items-center space-x-2">
                  {/* Paleta de colores rápida */}
                  <div className="flex space-x-1">
                    {[
                      '#3B82F6', // Blue
                      '#10B981', // Green  
                      '#F59E0B', // Yellow
                      '#EF4444', // Red
                      '#8B5CF6', // Purple
                      '#F97316', // Orange
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={`Cambiar a ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">Cerrar</span>
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
