import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const orders = new Hono<{ Bindings: Env }>()

// Schema para crear orden
const createOrderSchema = z.object({
  tenantSlug: z.string().min(1, 'Tenant requerido'),
  customerInfo: z.object({
    name: z.string().min(2, 'Nombre requerido'),
    phone: z.string().min(10, 'Teléfono requerido'),
    email: z.string().email().optional()
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1, 'Al menos un producto requerido'),
  total: z.number().positive(),
  notes: z.string().optional()
})

// POST /orders - Crear orden (para checkout via WhatsApp)
orders.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = createOrderSchema.parse(body)
    
    // TODO: Validar que los productos existan y tengan stock
    // TODO: Verificar que el tenant existe
    
    const newOrder = {
      id: `order_${Date.now()}`,
      ...validatedData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // TODO: Guardar en MongoDB
    // TODO: Enviar notificación al comercio via WhatsApp/Email
    
    return c.json({
      success: true,
      message: 'Orden creada exitosamente',
      order: newOrder
    }, 201)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Create order error:', error)
    return c.json({
      error: 'Error al crear orden'
    }, 500)
  }
})

// GET /orders - Listar órdenes del tenant
orders.get('/', async (c) => {
  try {
    const tenantSlug = c.req.query('tenant')
    const status = c.req.query('status')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    
    if (!tenantSlug) {
      return c.json({
        error: 'Tenant requerido'
      }, 400)
    }
    
    // TODO: Verificar autenticación y permisos
    // TODO: Obtener órdenes de MongoDB
    
    return c.json({
      success: true,
      orders: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    })
    
  } catch (error) {
    console.error('Get orders error:', error)
    return c.json({
      error: 'Error al obtener órdenes'
    }, 500)
  }
})

export default orders
