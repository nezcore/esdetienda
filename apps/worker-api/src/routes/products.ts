import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const products = new Hono<{ Bindings: Env }>()

// Parámetros via multipart/form-data para crear producto
const createProductSchema = z.object({
  tenantId: z.string().uuid('Tenant inválido'),
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.preprocess((v) => (v === '' || v === undefined || v === null ? undefined : Number(v)), z.number().positive('Precio debe ser positivo').optional()),
  category: z.string().min(1, 'Categoría requerida'),
  stock: z.preprocess((v) => (v === '' || v === undefined || v === null ? 0 : Number(v)), z.number().int().min(0, 'Stock no puede ser negativo')).optional(),
})

// GET /products - Listar productos del tenant
products.get('/', async (c) => {
  try {
    const tenantId = c.req.query('tenantId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    
    if (!tenantId) {
      return c.json({
        error: 'Tenant requerido'
      }, 400)
    }
    
    const supabase = c.get('supabase')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
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
    const form = await c.req.formData()

    const raw = {
      tenantId: String(form.get('tenantId') || ''),
      name: String(form.get('name') || ''),
      description: (form.get('description') as string) || undefined,
      price: form.get('price') as any,
      category: String(form.get('category') || ''),
      stock: form.get('stock') as any,
    }

    const validatedData = createProductSchema.parse(raw)

    // Validar imágenes
    const files = form.getAll('images') as File[]
    if (!files || files.length === 0) {
      return c.json({ error: 'Se requiere al menos una imagen' }, 400)
    }
    const maxBytes = 4 * 1024 * 1024 // 4MB
    const uploadUrls: string[] = []
    for (const file of files) {
      if (!(file instanceof File)) continue
      if (file.size > maxBytes) {
        return c.json({ error: `La imagen '${file.name}' supera 4MB` }, 400)
      }
      const arrayBuf = await file.arrayBuffer()
      const key = `${validatedData.tenantId}/${Date.now()}-${encodeURIComponent(file.name)}`
      await c.env.R2.put(key, new Uint8Array(arrayBuf), {
        httpMetadata: { contentType: file.type }
      })
      const publicBase = (c.env as any).R2_PUBLIC_BASE || ''
      const url = publicBase ? `${publicBase}/${key}` : key
      uploadUrls.push(url)
    }

    const supabase = c.get('supabase')
    const { data, error } = await supabase.from('products').insert({
      tenant_id: validatedData.tenantId,
      name: validatedData.name,
      description: validatedData.description ?? null,
      price: validatedData.price ?? null,
      category: validatedData.category,
      stock: (validatedData.stock as number | undefined) ?? 0,
      images: uploadUrls,
      status: 'active'
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
