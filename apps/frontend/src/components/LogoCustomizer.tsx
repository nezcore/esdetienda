import { useState } from 'react'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react'

interface LogoCustomizerProps {
  currentLogo?: string
  currentIcon?: string
  onSave: (logoData: { type: 'icon' | 'image' | 'emoji', value: string }) => void
  onClose: () => void
}

export default function LogoCustomizer({ 
  currentLogo, 
  currentIcon, 
  onSave, 
  onClose 
}: LogoCustomizerProps) {
  const [selectedType, setSelectedType] = useState<'icon' | 'image' | 'emoji'>('icon')
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || '🏪')
  const [uploadedImage, setUploadedImage] = useState<string | null>(currentLogo || null)
  const [selectedEmoji, setSelectedEmoji] = useState('🏪')

  // Iconos predefinidos para tiendas
  const predefinedIcons = [
    '🏪', '🛒', '🛍️', '🏬', '🏭', '🏢',
    '⚡', '🔧', '🔨', '⚙️', '🛠️', '🔩',
    '💡', '🎯', '⭐', '💎', '🚀', '🎨',
    '📱', '💻', '🎧', '📷', '⌚', '🔌',
    '👕', '👔', '👗', '👠', '🧥', '👜',
    '🍕', '🍔', '☕', '🍰', '🥘', '🍜',
    '💊', '🏥', '💉', '🩺', '🦷', '👩‍⚕️',
    '📚', '✏️', '📝', '🎓', '📖', '🖊️',
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌱',
    '🚗', '🚙', '🏍️', '🚲', '⛽', '🔋'
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setSelectedType('image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedType === 'icon' || selectedType === 'emoji') {
      onSave({ type: selectedType, value: selectedIcon })
    } else if (selectedType === 'image' && uploadedImage) {
      onSave({ type: 'image', value: uploadedImage })
    }
  }

  const renderPreview = () => {
    if (selectedType === 'image' && uploadedImage) {
      return (
        <img 
          src={uploadedImage} 
          alt="Logo preview" 
          className="w-16 h-16 rounded-xl object-cover"
        />
      )
    } else {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
          {selectedIcon}
        </div>
      )
    }
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
              <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Personalizar Logo
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Vista previa */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Vista previa
            </h3>
            <div className="flex items-center justify-center">
              {renderPreview()}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'icon', label: 'Iconos', icon: '🏪' },
              { id: 'image', label: 'Imagen', icon: '🖼️' },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setSelectedType(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedType === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedType === 'icon' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selecciona un icono
                </h3>
                <div className="grid grid-cols-6 gap-3">
                  {predefinedIcons.map((icon, index) => (
                    <button
                      key={`icon-${index}-${icon}`}
                      onClick={() => {
                        setSelectedIcon(icon)
                        setSelectedType('icon')
                      }}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl hover:scale-110 transition-all ${
                        selectedIcon === icon
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedType === 'image' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sube tu imagen
                </h3>
                
                <div className="space-y-4">
                  {/* Upload area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Haz clic para subir una imagen
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, GIF hasta 5MB
                      </p>
                    </label>
                  </div>

                  {/* Current uploaded image */}
                  {uploadedImage && (
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded logo"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Recomendaciones:</p>
                    <ul className="space-y-1">
                      <li>• Imagen cuadrada (1:1) para mejor resultado</li>
                      <li>• Tamaño mínimo: 200x200px</li>
                      <li>• Fondo transparente para mejor integración</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={selectedType === 'image' && !uploadedImage}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
