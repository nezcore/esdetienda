import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Filter, ShoppingCart, MessageCircle } from 'lucide-react'

export default function StorePage() {
  const { tenantSlug } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState(0)
  
  // Simulación de datos del tenant
  const storeData = {
    name: `Tienda ${tenantSlug}`,
    description: 'Tu tienda de confianza',
    whatsapp: '+1-809-555-0123',
    colors: {
      primary: '#134572',
      secondary: '#27A3A4'
    }
  }

  const sampleProducts = [
    {
      id: '1',
      name: 'Producto de ejemplo',
      price: 1500,
      image: 'https://via.placeholder.com/300x300',
      category: 'General'
    }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar búsqueda real
    console.log('Buscando:', searchQuery)
  }

  const addToCart = (productId: string) => {
    setCartItems(prev => prev + 1)
    // TODO: Implementar carrito real
    console.log('Añadido al carrito:', productId)
  }

  const goToWhatsApp = () => {
    const message = `¡Hola! Estoy interesado en productos de ${storeData.name}`
    const whatsappUrl = `https://wa.me/${storeData.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  useEffect(() => {
    // Simular PostHog event
    console.log('PostHog: store_visited', { tenantSlug })
  }, [tenantSlug])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la tienda */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {storeData.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Carrito */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-6 w-6" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
              
              {/* Botón WhatsApp */}
              <button 
                onClick={goToWhatsApp}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero/Banner */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{storeData.name}</h2>
          <p className="text-brand-100 mb-6">{storeData.description}</p>
          
          {/* Buscador */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="flex-1 px-4 py-3 rounded-l-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit"
                className="bg-white text-brand-500 px-6 py-3 rounded-r-xl hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className="lg:w-64">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500">
                    <option>Todas las categorías</option>
                    <option>Electrónicos</option>
                    <option>Ropa</option>
                    <option>Hogar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>RD$0</span>
                      <span>RD$10,000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Productos
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-2">
                <option>Ordenar por relevancia</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
                <option>Más nuevo</option>
              </select>
            </div>

            {/* Productos */}
            {sampleProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Esta tienda está aún configurando su catálogo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-900">
                          RD${product.price.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => addToCart(product.id)}
                          className="bg-brand-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-brand-600 transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <button 
        onClick={goToWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
