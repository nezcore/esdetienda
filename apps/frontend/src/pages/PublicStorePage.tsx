import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  ArrowLeft, 
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Share2,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react'
import { api } from '../lib/api'
import { ThemeProvider } from '../components/ThemeProvider'
import StoreBanner from '../components/StoreBanner'

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
  whatsappNumber?: string
}

export default function PublicStorePageNew() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

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
    const message = `¡Hola! Me interesa el producto "${product.name}" que vi en tu tienda ${store?.business_name}. ¿Podrías darme más información?`
    const whatsappNumber = store?.whatsappNumber || '18091234567'
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Mira este producto: ${product.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // TODO: Mostrar toast de "Link copiado"
    }
  }

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Tienda no encontrada'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error ? 'Ocurrió un error al cargar la tienda.' : 'La tienda que buscas no existe o no está disponible.'}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const storeTheme = {
    primaryColor: store.colors?.primary || '#3B82F6',
    secondaryColor: store.colors?.secondary || '#1E40AF',
  }

  return (
    <ThemeProvider initialTheme={storeTheme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Banner fijo */}
        <StoreBanner 
          storeName={store.business_name}
          storeSlug={store.slug}
          showCustomization={false} // TODO: Detectar si es el propietario
        />

        {/* Espaciador para el banner fijo */}
        <div className="h-14"></div>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 overflow-hidden">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              {/* Logo de la tienda - más pequeño */}
              <div className="mb-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto shadow-xl">
                  {store.logo ? (
                    <img src={store.logo} alt={store.business_name} className="w-12 h-12 rounded-lg" />
                  ) : (
                    <ShoppingBag className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>

              {/* Nombre y descripción - más compacto */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                {store.business_name}
              </h1>
              {store.description && (
                <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto mb-6 leading-relaxed">
                  {store.description}
                </p>
              )}

              {/* Solo botón de WhatsApp */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => {
                    const message = `¡Hola! Me interesa conocer más sobre ${store.business_name}`
                    const whatsappNumber = store.whatsappNumber || '18091234567'
                    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactar por WhatsApp
                </button>
              </div>

              {/* Estadísticas - más compactas */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{products.length}</div>
                  <div className="text-white/80 text-sm">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{categories.length}</div>
                  <div className="text-white/80 text-sm">Categorías</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">5★</div>
                  <div className="text-white/80 text-sm">Calificación</div>
                </div>
              </div>
            </div>
          </div>

          {/* Onda decorativa */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64V120H1392C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120H0V64Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"/>
            </svg>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-14 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Toggle vista */}
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl p-1 bg-white dark:bg-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery || selectedCategory ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || selectedCategory 
                  ? 'Intenta con otros términos de búsqueda o filtros.' 
                  : 'Esta tienda aún no ha agregado productos.'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Imagen del producto */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                    <img
                      src={(product.images && product.images.length > 0) ? product.images[0] : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-product.jpg'
                      }}
                    />
                    
                    {/* Botones de acción flotantes */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-colors ${
                          favorites.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => shareProduct(product)}
                        className="p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-blue-50 shadow-lg transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Badge de stock */}
                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                          ¡Solo {product.stock} disponibles!
                        </span>
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Agotado</span>
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-6">
                    <div className="mb-3">
                      {product.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full mb-2">
                          {product.category}
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(product.price)}
                      </div>
                      {product.stock !== undefined && product.stock > 5 && (
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          En stock
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => sendToWhatsApp(product)}
                      disabled={product.stock === 0}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center group-hover:shadow-lg transform group-hover:scale-105"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Consultar por WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Información de la tienda */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{store.business_name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {store.description || 'Tu tienda de confianza'}
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Categorías */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  Categorías
                </h4>
                <ul className="space-y-2">
                  {categories.slice(0, 5).map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  Contacto
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {store.whatsappNumber || '+1-809-555-0123'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">República Dominicana</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Lun - Dom: 8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">EsDeTienda</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
