import { useState } from 'react'
import { Palette, Eye, Save, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ThemeProvider } from '../components/ThemeProvider'
import StoreCustomizer from '../components/StoreCustomizer'

export default function CustomizationPage() {
  const { tenant } = useAuth()
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleSaveTheme = async (theme: any) => {
    try {
      // TODO: Guardar tema en la base de datos
      console.log('Guardando tema:', theme)
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Cerrar panel
      setShowCustomizer(false)
      
      // TODO: Mostrar toast de éxito
      alert('¡Tema guardado exitosamente!')
      
    } catch (error) {
      console.error('Error guardando tema:', error)
      alert('Error al guardar el tema')
    }
  }

  const openStorePreview = () => {
    if (tenant?.slug) {
      window.open(`/str/${tenant.slug}`, '_blank')
    }
  }

  return (
    <ThemeProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Personalización de Tienda
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Customiza el diseño, colores y layout de tu tienda online
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openStorePreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Vista previa
            </button>
            <button
              onClick={() => setShowCustomizer(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Palette className="h-4 w-4" />
              Personalizar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tema Actual</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Azul Océano</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visitas Hoy</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Save className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Cambio</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opciones Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Opciones Rápidas
            </h2>
            
            <div className="space-y-4">
              {/* Paletas rápidas */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Cambiar Paleta de Colores
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Azul', colors: ['#3B82F6', '#1E40AF', '#F59E0B'] },
                    { name: 'Verde', colors: ['#10B981', '#059669', '#F59E0B'] },
                    { name: 'Púrpura', colors: ['#8B5CF6', '#7C3AED', '#F59E0B'] },
                    { name: 'Rojo', colors: ['#EF4444', '#DC2626', '#F59E0B'] },
                    { name: 'Naranja', colors: ['#F97316', '#EA580C', '#3B82F6'] },
                    { name: 'Rosa', colors: ['#EC4899', '#DB2777', '#F59E0B'] },
                  ].map((palette) => (
                    <button
                      key={palette.name}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors group"
                      onClick={() => {
                        // TODO: Aplicar paleta rápidamente
                        console.log('Aplicando paleta:', palette.name)
                      }}
                    >
                      <div className="flex space-x-1 mb-2">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {palette.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuraciones rápidas */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Configuraciones Rápidas
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar búsqueda</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Filtro de categorías</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Enlaces sociales</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Vista Previa
              </h2>
              <button
                onClick={openStorePreview}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Ver en nueva pestaña →
              </button>
            </div>
            
            {/* Miniatura de la tienda */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {/* Header simulado */}
                <div className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center px-3">
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                  <div className="ml-2 h-3 bg-white/30 rounded w-20"></div>
                </div>
                
                {/* Hero simulado */}
                <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="h-4 bg-white/30 rounded w-24 mx-auto mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-32 mx-auto"></div>
                  </div>
                </div>
                
                {/* Productos simulados */}
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Los cambios se reflejan en tiempo real
              </p>
              <button
                onClick={() => setShowCustomizer(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
              >
                Abrir Panel de Personalización
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                ¿Cómo funciona la personalización?
              </h3>
              <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                <ul className="list-disc list-inside space-y-1">
                  <li>Los cambios se aplican en tiempo real a tu tienda</li>
                  <li>Puedes probar diferentes combinaciones sin afectar a tus clientes</li>
                  <li>Guarda los cambios cuando estés satisfecho con el resultado</li>
                  <li>Siempre puedes volver a la configuración anterior</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Personalización */}
      <StoreCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        onSave={handleSaveTheme}
      />
    </ThemeProvider>
  )
}
