import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, MessageCircle, Star, Share2 } from 'lucide-react'

export default function ProductPage() {
  const { tenantSlug, productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  
  // Simulación de datos del producto
  const product = {
    id: productId,
    name: 'Producto de ejemplo',
    description: 'Descripción detallada del producto. Acá va toda la información relevante sobre características, especificaciones y beneficios.',
    price: 1500,
    originalPrice: 2000,
    stock: 10,
    images: [
      'https://via.placeholder.com/600x600',
      'https://via.placeholder.com/600x600/ff0000',
      'https://via.placeholder.com/600x600/00ff00'
    ],
    category: 'Electrónicos',
    brand: 'Marca Ejemplo',
    rating: 4.5,
    reviews: 23,
    attributes: {
      'Color': 'Negro',
      'Talla': 'M',
      'Material': 'Algodón'
    }
  }

  const storeData = {
    name: `Tienda ${tenantSlug}`,
    whatsapp: '+1-809-555-0123'
  }

  const addToCart = () => {
    // TODO: Implementar carrito real
    console.log('Añadido al carrito:', { productId, quantity })
    
    // Simular PostHog event
    console.log('PostHog: add_to_cart', { 
      productId, 
      tenantSlug, 
      quantity, 
      price: product.price 
    })
  }

  const buyNowWhatsApp = () => {
    const message = `¡Hola! Quiero comprar:\n\n${product.name}\nCantidad: ${quantity}\nPrecio: RD$${(product.price * quantity).toLocaleString()}\n\n¿Cómo procedo con el pago?`
    const whatsappUrl = `https://wa.me/${storeData.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Simular PostHog event
    console.log('PostHog: checkout_started', { 
      productId, 
      tenantSlug, 
      quantity, 
      total: product.price * quantity 
    })
  }

  const shareProduct = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `¡Mira este producto en ${storeData.name}!`,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Enlace copiado al portapapeles')
    }
  }

  useEffect(() => {
    // Simular PostHog event
    console.log('PostHog: product_viewed', { 
      productId, 
      tenantSlug, 
      productName: product.name,
      price: product.price 
    })
  }, [productId, tenantSlug, product.name, product.price])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            <Link 
              to={`/str/${tenantSlug}`} 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Volver
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {storeData.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={shareProduct}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imágenes del producto */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-brand-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-600 mb-4">
                <span>{product.category}</span> / <span>{product.brand}</span>
              </nav>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviews} reseñas)
                </span>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-brand-900">
                    RD${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      RD${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-green-600 text-sm font-medium">
                    Ahorra RD${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Atributos */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Especificaciones</h3>
                <div className="space-y-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm">
                    {product.stock > 0 
                      ? `${product.stock} disponibles` 
                      : 'Sin stock'
                    }
                  </span>
                </div>
              </div>

              {/* Selector de cantidad */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 h-10 border border-gray-300 rounded-lg flex items-center justify-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button 
                  onClick={buyNowWhatsApp}
                  disabled={product.stock === 0}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comprar por WhatsApp
                </button>
                
                <button 
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="w-full border-2 border-brand-500 text-brand-500 py-3 rounded-xl font-semibold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar al carrito
                </button>
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-brand-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-brand-900">
                    RD${(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
