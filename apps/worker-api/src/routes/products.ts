import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const products = new Hono<{ Bindings: Env }>()

// Schema para crear producto
const createProductSchema = z.object({
  tenantSlug: z.string().min(3, 'Tenant requerido'),
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
    
    const supabase = c.get('supabase')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_slug', tenantSlug)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase get products error:', error)
      return c.json({
        error: 'Error al obtener productos'
      }, 500)
    }
    
    return c.json({
      success: true,
      products: data ?? [],
      pagination: {
        page,
        limit,
        total: data?.length ?? 0,
        pages: data ? Math.ceil(data.length / limit) : 0
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
    const supabase = c.get('supabase')
    const { data, error } = await supabase.from('products').insert({
      tenant_slug: validatedData.tenantSlug,
      name: validatedData.name,
      description: validatedData.description ?? null,
      price: validatedData.price,
      original_price: validatedData.originalPrice ?? null,
      brand: validatedData.brand ?? null,
      category: validatedData.category ?? null,
      stock: validatedData.stock,
      images: validatedData.images ?? [],
      attributes: validatedData.attributes ?? {}
    }).select('*').single()

    if (error) {
      console.error('Supabase create product error:', error)
      return c.json({
        error: 'Error al crear producto'
      }, 500)
    }
    
    return c.json({
      success: true,
      message: 'Producto creado exitosamente',
      product: data
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
