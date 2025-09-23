import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  BarChart3, 
  Package, 
  MessageCircle, 
  Settings, 
  Upload,
  ExternalLink,
  Plus
} from 'lucide-react'

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(searchParams.get('welcome') === 'true')
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                EsDeTienda
              </span>
              <span className="ml-4 text-gray-600">/ Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-brand-500 hover:text-brand-700">
                <ExternalLink className="h-5 w-5" />
                <span className="ml-1 text-sm">Ver mi tienda</span>
              </button>
              <div className="h-8 w-8 bg-brand-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-brand-gradient text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-brand-500" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{stat.change} vs ayer</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Productos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Catálogo de productos
                </h3>
                <div className="flex space-x-2">
                  <button className="bg-brand-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-brand-600 flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    Importar
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes productos aún
                </h4>
                <p className="text-gray-600 mb-4">
                  Sube tu primer producto o importa un catálogo completo desde CSV/Excel
                </p>
                <div className="space-y-2">
                  <button className="bg-brand-500 text-white px-6 py-2 rounded-xl hover:bg-brand-600 transition-colors">
                    Agregar producto
                  </button>
                  <br />
                  <button className="text-brand-500 hover:text-brand-700 text-sm">
                    Ver guía de importación →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Configuración
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-brand-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Bot</p>
                      <p className="text-sm text-gray-600">Pendiente configuración</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pendiente
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-brand-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Configuración general</p>
                      <p className="text-sm text-gray-600">Datos del negocio, colores</p>
                    </div>
                  </div>
                  <button className="text-brand-500 hover:text-brand-700 text-sm">
                    Configurar
                  </button>
                </div>

                <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-brand-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-brand-900">
                        Tu bot estará listo en 24 horas
                      </h4>
                      <p className="text-sm text-brand-700 mt-1">
                        Te enviaremos un email cuando esté configurado. Mientras tanto, sube tus productos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
