import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Share2, Star, MessageCircle, ArrowRight } from 'lucide-react'

import { api } from '../lib/api'
import StoreLogo from '../components/StoreLogo'

interface ProductDetail {
  id: string
  name: string
  description?: string
  price?: number | null
  images?: string[]
  category?: string | null
  stock?: number | null
  status?: string
  attributes?: Record<string, string>
  created_at?: string
}

interface StoreDetail {
  id: string
  slug: string
  business_name: string
  logo?: string
  icon?: string
  whatsappNumber?: string
}

const formatPrice = (price?: number | null) => {
  if (!price) return 'Precio no disponible'
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0
  }).format(price)
}

export default function ProductPage() {
  const navigate = useNavigate()
  const { tenantSlug, productId } = useParams<{ tenantSlug: string; productId: string }>()

  const [store, setStore] = useState<StoreDetail | null>(null)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!tenantSlug || !productId) {
        setError('Producto no disponible')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const tenantResponse = await api.get<{ success: boolean; tenant?: StoreDetail }>(`/tenants/${tenantSlug}`)
        if (!tenantResponse.success || !tenantResponse.tenant) {
          setError('Tienda no encontrada')
          setIsLoading(false)
          return
        }

        setStore(tenantResponse.tenant)

        const productResponse = await api.get<{ success: boolean; product?: ProductDetail }>(
          `/products/${productId}?tenantId=${tenantResponse.tenant.id}`
        )

        if (!productResponse.success || !productResponse.product) {
          setError('Producto no disponible')
          setIsLoading(false)
          return
        }

        setProduct(productResponse.product)

        const relatedResponse = await api.get<{ products: ProductDetail[] }>(
          `/products?tenantId=${tenantResponse.tenant.id}`
        )

        const related = (relatedResponse.products || [])
          .filter((p) => p.id !== productResponse.product?.id && p.status === 'active')
          .slice(0, 4)

        setRelatedProducts(related)
      } catch (err: any) {
        console.error('Error cargando producto:', err)
        setError(err.message || 'No se pudo cargar el producto')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tenantSlug, productId])

  useEffect(() => {
    if (product && product.images?.length) {
      setSelectedImageIndex(0)
    }
  }, [productId, product?.images?.length])

  const handleShare = () => {
    if (!product || !store) return
    const url = window.location.href
    const text = `Descubre ${product.name} en ${store.business_name}!`

    if (navigator.share) {
      navigator.share({ title: product.name, text, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Enlace copiado al portapapeles')
    }
  }

  const handleWhatsApp = (quantity = 1) => {
    if (!store || !product) return
    const whatsappNumber = store.whatsappNumber || '18091234567'
    const message = `¡Hola! Me interesa el producto "${product.name}".
Cantidad: ${quantity}
Precio estimado: ${formatPrice((product.price || 0) * quantity)}

¿Podrías darme más información?`

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const formattedAttributes = useMemo(() => {
    if (!product?.attributes) return []
    return Object.entries(product.attributes)
  }, [product?.attributes])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !store || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{error || 'Producto no disponible'}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Puede que el producto haya sido despublicado o que la tienda no esté disponible en este momento.
          </p>
          <Link
            to={`/str/${tenantSlug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to={`/str/${store.slug}`}
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="h-5 w-5 mr-1" /> Volver a la tienda
              </Link>
              <div className="hidden sm:flex items-center gap-3">
                <StoreLogo logo={store.logo} icon={store.icon} storeName={store.business_name} size="sm" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tienda</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{store.business_name}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="h-4 w-4" /> Compartir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-[420px] sm:h-[480px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-product.jpg'
                }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, idx) => (
                  <button
                    key={image + idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-500 ring-2 ring-blue-100'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-product.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.category && (
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full">
                    {product.category}
                  </span>
                )}
                {product.stock !== undefined && product.stock > 0 && (
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full">
                    Disponible
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Producto destacado de {store.business_name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.description && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Descripción</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {formattedAttributes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Características</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formattedAttributes.map(([key, value]) => (
                    <div
                      key={key}
                      className="border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 bg-gray-50 dark:bg-gray-800/60"
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{key}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
              <p className={`text-sm font-semibold ${
                product.stock !== undefined && product.stock > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-500'
              }`}>
                {product.stock !== undefined
                  ? product.stock > 0
                    ? `${product.stock} unidades disponibles`
                    : 'Sin stock'
                  : 'Consultar disponibilidad'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleWhatsApp(1)}
                className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
              </button>
              <button
                onClick={() => navigate(`/str/${store.slug}`)}
                className="border border-blue-500 text-blue-600 dark:text-blue-300 py-3 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-5 w-5" /> Ver más productos
              </button>
            </div>
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">También te puede interesar</h2>
              <Link
                to={`/str/${store.slug}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/str/${store.slug}/producto/${related.id}`)}
                  className="text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={related.images?.[0] || '/placeholder-product.jpg'}
                      alt={related.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-product.jpg'
                      }}
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{related.category || 'Producto'}</p>
                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">{related.name}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">{formatPrice(related.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
