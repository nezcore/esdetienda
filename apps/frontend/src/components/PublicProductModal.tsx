import { useEffect } from 'react'
import { X, Share2 } from 'lucide-react'
import StoreLogo from './StoreLogo'

interface ProductInfo {
  id: string
  name: string
  description?: string
  price?: number | null
  images?: string[]
  category?: string | null
  stock?: number | null
}

interface StoreInfo {
  business_name: string
  logo?: string
  icon?: string
  whatsappNumber?: string
  slug: string
}

interface PublicProductModalProps {
  product: ProductInfo
  store: StoreInfo
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onShare: () => void
  onWhatsApp: () => void
  onViewFull: () => void
}

const formatPrice = (price?: number | null) => {
  if (!price) return 'Precio no disponible'
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0
  }).format(price)
}

export default function PublicProductModal({
  product,
  store,
  isOpen,
  isLoading = false,
  onClose,
  onShare,
  onWhatsApp,
  onViewFull
}: PublicProductModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-8 sm:py-16 backdrop-blur-sm bg-black/50" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-gray-100 dark:bg-gray-800">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-product.jpg'
                }}
              />
            )}

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur rounded-2xl p-3 flex items-center gap-3 shadow-lg">
              <StoreLogo
                logo={store.logo}
                icon={store.icon}
                storeName={store.business_name}
                size="sm"
              />
              <div className="truncate">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tienda</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{store.business_name}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-2">{product.category || 'Producto'}</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                  {product.description}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(product.price)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Disponibilidad</p>
              {typeof product.stock === 'number' ? (
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} en inventario` : 'Sin stock'}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">Consultar disponibilidad</p>
              )}
            </div>

            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onViewFull}
                className="w-full border border-blue-500 text-blue-600 dark:text-blue-300 py-2.5 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                Ver página completa
              </button>
              <button
                onClick={onWhatsApp}
                className="w-full bg-green-500 text-white py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Consultar por WhatsApp
              </button>
            </div>

            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Share2 className="h-4 w-4" /> Compartir producto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
