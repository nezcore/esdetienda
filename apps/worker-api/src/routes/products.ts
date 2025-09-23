import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const products = new Hono<{ Bindings: Env }>()

// Schema para crear producto
const createProductSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  originalPrice: z.number().positive().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
  images: z.array(z.string().url()).optional(),
  attributes: z.record(z.string()).optional()
})

// GET /products - Listar productos del tenant
products.get('/', async (c) => {
  try {
    const tenantSlug = c.req.query('tenant')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    
    if (!tenantSlug) {
      return c.json({
        error: 'Tenant requerido'
      }, 400)
    }
    
    // TODO: Obtener productos reales de MongoDB
    const mockProducts = []
    
    return c.json({
      success: true,
      products: mockProducts,
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    })
    
  } catch (error) {
    console.error('Get products error:', error)
    return c.json({
      error: 'Error al obtener productos'
    }, 500)
  }
})

// POST /products - Crear producto
products.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = createProductSchema.parse(body)
    
    // TODO: Verificar autenticación y permisos del tenant
    // TODO: Crear producto en MongoDB
    
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return c.json({
      success: true,
      message: 'Producto creado exitosamente',
      product: newProduct
    }, 201)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Create product error:', error)
    return c.json({
      error: 'Error al crear producto'
    }, 500)
  }
})

// POST /products/import - Importar productos desde CSV/Excel
products.post('/import', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({
        error: 'Archivo requerido'
      }, 400)
    }
    
    // TODO: Procesar CSV/Excel
    // TODO: Validar productos
    // TODO: Insertar en MongoDB
    
    return c.json({
      success: true,
      message: 'Productos importados exitosamente',
      imported: 0,
      errors: []
    })
    
  } catch (error) {
    console.error('Import products error:', error)
    return c.json({
      error: 'Error al importar productos'
    }, 500)
  }
})

export default products
