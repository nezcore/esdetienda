import { useState } from 'react'
import { X, Palette, Layout, Type, RefreshCw, Save } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface StoreCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (theme: any) => void
}

export default function StoreCustomizer({ isOpen, onClose, onSave }: StoreCustomizerProps) {
  if (!isOpen) return null

  const { storeTheme, setStoreTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'colors' | 'layout' | 'content'>('colors')
  const [tempTheme, setTempTheme] = useState(storeTheme)

  const colorPresets = [
    { name: 'Azul Océano', primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
    { name: 'Verde Esmeralda', primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
    { name: 'Púrpura Real', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Rojo Pasión', primary: '#EF4444', secondary: '#DC2626', accent: '#F59E0B' },
    { name: 'Naranja Vibrante', primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6' },
    { name: 'Rosa Moderno', primary: '#EC4899', secondary: '#DB2777', accent: '#F59E0B' },
  ]

  const fontOptions = [
    { name: 'Inter (Moderno)', value: 'Inter' },
    { name: 'Roboto (Clásico)', value: 'Roboto' },
    { name: 'Poppins (Friendly)', value: 'Poppins' },
    { name: 'Montserrat (Elegante)', value: 'Montserrat' },
  ]

  const borderRadiusOptions = [
    { name: 'Ninguno', value: 'none' },
    { name: 'Pequeño', value: 'sm' },
    { name: 'Medio', value: 'md' },
    { name: 'Grande', value: 'lg' },
    { name: 'Extra Grande', value: 'xl' },
    { name: 'Redondeado', value: 'full' },
  ]

  const layoutOptions = [
    { name: 'Cuadrícula', value: 'grid', icon: '⊞' },
    { name: 'Lista', value: 'list', icon: '☰' },
    { name: 'Masonería', value: 'masonry', icon: '▦' },
  ]

  const headerStyles = [
    { name: 'Minimalista', value: 'minimal' },
    { name: 'Gradiente', value: 'gradient' },
    { name: 'Con Imagen', value: 'image' },
    { name: 'Video', value: 'video' },
  ]

  const updateTheme = (updates: Partial<typeof tempTheme>) => {
    const newTheme = { ...tempTheme, ...updates }
    setTempTheme(newTheme)
    setStoreTheme(newTheme)
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    updateTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      gradientFrom: preset.primary,
      gradientTo: preset.secondary,
    })
  }

  const resetToDefaults = () => {
    const defaultTheme = {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      cardColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      gradientFrom: '#3B82F6',
      gradientTo: '#1E40AF',
      fontFamily: 'Inter',
      borderRadius: 'lg' as const,
      layout: 'grid' as const,
      headerStyle: 'gradient' as const,
      showSocialLinks: true,
      showSearch: true,
      showCategories: true,
    }
    setTempTheme(defaultTheme)
    setStoreTheme(defaultTheme)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Personalizar Tienda
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'colors', label: 'Colores', icon: Palette },
              { id: 'layout', label: 'Diseño', icon: Layout },
              { id: 'content', label: 'Contenido', icon: Type },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Presets de colores */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Paletas Predefinidas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                      >
                        <div className="flex space-x-1 mb-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {preset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colores personalizados */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Colores Personalizados
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Primario
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempTheme.primaryColor}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={tempTheme.primaryColor}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Secundario
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempTheme.secondaryColor}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={tempTheme.secondaryColor}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color de Acento
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempTheme.accentColor}
                          onChange={(e) => updateTheme({ accentColor: e.target.value })}
                          className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={tempTheme.accentColor}
                          onChange={(e) => updateTheme({ accentColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                {/* Diseño de productos */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Diseño de Productos
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {layoutOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateTheme({ layout: option.value as any })}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          tempTheme.layout === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-xs font-medium">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estilo del header */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Estilo del Header
                  </h3>
                  <div className="space-y-2">
                    {headerStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateTheme({ headerStyle: style.value as any })}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          tempTheme.headerStyle === style.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border radius */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Bordes Redondeados
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {borderRadiusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateTheme({ borderRadius: option.value as any })}
                        className={`p-2 text-xs rounded border transition-colors ${
                          tempTheme.borderRadius === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipografía */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Tipografía
                  </h3>
                  <select
                    value={tempTheme.fontFamily}
                    onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Elementos visibles */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Elementos Visibles
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempTheme.showSearch}
                        onChange={(e) => updateTheme({ showSearch: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar barra de búsqueda
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempTheme.showCategories}
                        onChange={(e) => updateTheme({ showCategories: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar filtro de categorías
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempTheme.showSocialLinks}
                        onChange={(e) => updateTheme({ showSocialLinks: e.target.checked })}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar enlaces sociales
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <button
                onClick={resetToDefaults}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Resetear</span>
              </button>
              <button
                onClick={() => onSave(tempTheme)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
