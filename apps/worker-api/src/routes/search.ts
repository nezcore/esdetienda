import { Hono } from 'hono'
import { Env } from '../index'

const search = new Hono<{ Bindings: Env }>()

// GET /search - Búsqueda de productos
search.get('/', async (c) => {
  try {
    const query = c.req.query('q') || ''
    const brand = c.req.query('brand')
    const category = c.req.query('category')
    const tenantSlug = c.req.query('tenant') || 'demo'
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 50)
    
    // TODO: Implementar búsqueda real con MongoDB/Hyperdrive
    // Por ahora, devolver productos de ejemplo
    const mockProducts = [
      {
        id: 'prod_1',
        name: 'Producto de ejemplo 1',
        description: 'Descripción del producto',
        price: 1500,
        originalPrice: 2000,
        brand: 'Marca A',
        category: 'Electrónicos',
        image: 'https://via.placeholder.com/300x300',
        stock: 10,
        tenantSlug
      },
      {
        id: 'prod_2', 
        name: 'Producto de ejemplo 2',
        description: 'Otra descripción',
        price: 2500,
        brand: 'Marca B',
        category: 'Ropa',
        image: 'https://via.placeholder.com/300x300',
        stock: 5,
        tenantSlug
      }
    ]
    
    // Filtrar productos según parámetros
    let filteredProducts = mockProducts
    
    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    if (brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase() === brand.toLowerCase()
      )
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return c.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      },
      filters: {
        query,
        brand,
        category
      }
    })
    
  } catch (error) {
    console.error('Search error:', error)
    return c.json({
      error: 'Error en la búsqueda',
      message: 'No se pudo realizar la búsqueda. Intenta de nuevo.'
    }, 500)
  }
})

// GET /search/suggestions - Sugerencias de búsqueda
search.get('/suggestions', async (c) => {
  const query = c.req.query('q') || ''
  const tenantSlug = c.req.query('tenant') || 'demo'
  
  // TODO: Implementar sugerencias reales
  const mockSuggestions = [
    'celular samsung',
    'laptop dell',
    'audifonos bluetooth',
    'camisa hombre',
    'zapatos deportivos'
  ].filter(s => s.includes(query.toLowerCase()))
  
  return c.json({
    success: true,
    suggestions: mockSuggestions.slice(0, 5)
  })
})

export default search
