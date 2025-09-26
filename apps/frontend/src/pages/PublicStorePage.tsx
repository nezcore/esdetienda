import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Star, ArrowLeft, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'

interface Product {
  id: string
  name: string
  description?: string
  price?: number
  images?: string[]
  category?: string
  stock?: number
  status?: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
  updated_at?: string
}

interface Store {
  id: string
  slug: string
  business_name: string
  plan: string
  status: string
  description?: string
  logo?: string
  colors?: {
    primary: string
    secondary: string
  }
}

export default function PublicStorePage() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStoreData()
  }, [tenantSlug])

  const loadStoreData = async () => {
    if (!tenantSlug) {
      setError('Slug de tienda no válido')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Obtener información del tenant por slug
      const tenantResponse = await api.get<{success: boolean, tenant?: Store}>(`/tenants/${tenantSlug}`)
      
      if (!tenantResponse.success || !tenantResponse.tenant) {
        setError('Tienda no encontrada')
        setLoading(false)
        return
      }

      const tenant = tenantResponse.tenant
      setStore(tenant)

      // 2. Cargar productos del tenant
      const productsResponse = await api.get<{products: Product[]}>(`/products?tenantId=${tenant.id}`)
      
      // Filtrar solo productos activos para la tienda pública
      const activeProducts = (productsResponse.products || []).filter(product => 
        product.status === 'active' && (product.stock === undefined || product.stock > 0)
      )
      
      setProducts(activeProducts)

    } catch (error: any) {
      console.error('Error al cargar datos de la tienda:', error)
      setError(error.message || 'Error al cargar la tienda')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'Precio no disponible'
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const sendToWhatsApp = (product: Product) => {
    const message = `Hola! Me interesa el producto "${product.name}" que vi en tu tienda. ¿Podrías darme más información?`
    const whatsappUrl = `https://wa.me/18091234567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Tienda no encontrada'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error ? 'Ocurrió un error al cargar la tienda.' : 'La tienda que buscas no existe o no está disponible.'}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center mr-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{store.business_name}</h1>
                <p className="text-sm text-gray-600">esdetienda.com/str/{store.slug}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                EsDeTienda
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Store info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{store.business_name}</h2>
            {store.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{store.description}</p>
            )}
            <div className="mt-6 flex justify-center space-x-4">
              <button className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            Productos ({products.length})
          </h3>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-600">Esta tienda aún no ha agregado productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Product image */}
                <div className="aspect-square bg-gray-200 relative">
                  <img
                    src={(product.images && product.images.length > 0) ? product.images[0] : '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-product.jpg'
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Agotado</span>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-brand-600">{formatPrice(product.price)}</span>
                    {product.category && (
                      <span className="text-sm text-gray-500">{product.category}</span>
                    )}
                  </div>

                  {product.stock !== undefined && product.stock > 0 && (
                    <p className="text-xs text-gray-500 mb-2">Stock: {product.stock} disponibles</p>
                  )}

                  <button
                    onClick={() => sendToWhatsApp(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Consultar por WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by <span className="font-semibold text-brand-600">EsDeTienda</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
