import { useState } from 'react'
import { X, Package, Calendar, Tag, DollarSign, Archive, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

type Product = {
  id: string
  name: string
  description?: string
  price?: number
  category?: string
  images?: string[]
  stock?: number
  status?: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
  updated_at?: string
}

interface ProductViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductViewModal({ product, isOpen, onClose }: ProductViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen) return null

  const formatPrice = (price?: number) => {
    if (!price) return 'Sin precio'
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (product: Product) => {
    if (product.stock === 0) {
      return {
        label: 'Sin stock',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
        icon: Archive
      }
    }
    if (product.status === 'inactive') {
      return {
        label: 'Inactivo',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        icon: Eye
      }
    }
    return {
      label: 'Activo',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      icon: Package
    }
  }

  const statusInfo = getStatusInfo(product)
  const StatusIcon = statusInfo.icon

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <Package className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles del producto
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {product.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imágenes */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? 'border-brand-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              {/* Nombre y estado */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {statusInfo.label}
                  </span>
                </div>
                {product.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Precio */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Categoría</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.category || 'Sin categoría'}
                    </p>
                  </div>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Archive className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.stock !== undefined ? `${product.stock} unidades` : 'Sin definir'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Fecha de creación
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(product.created_at)}
                    </p>
                  </div>
                </div>
                {product.updated_at && product.updated_at !== product.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Última actualización
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(product.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
