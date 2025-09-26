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
    console.log('🔍 Validando imágenes...')
    const files = form.getAll('images') as File[]
    console.log('📁 Archivos recibidos:', files.length)
    
    if (!files || files.length === 0) {
      console.log('❌ No se encontraron archivos')
      return c.json({ error: 'Se requiere al menos una imagen' }, 400)
    }
    
    const maxBytes = 4 * 1024 * 1024 // 4MB
    const uploadUrls: string[] = []
    
    console.log('🔧 R2 Bucket disponible:', !!c.env.R2)
    console.log('🌐 R2_PUBLIC_BASE:', c.env.R2_PUBLIC_BASE)
    
    for (const file of files) {
      if (!(file instanceof File)) {
        console.log('⚠️ Archivo no válido:', typeof file)
        continue
      }
      
      console.log('📄 Procesando archivo:', file.name, 'Tamaño:', file.size)
      
      if (file.size > maxBytes) {
        console.log('❌ Archivo muy grande:', file.name)
        return c.json({ error: `La imagen '${file.name}' supera 4MB` }, 400)
      }
      
      try {
        const arrayBuf = await file.arrayBuffer()
        const key = `${validatedData.tenantId}/${Date.now()}-${encodeURIComponent(file.name)}`
        
        console.log('⬆️ Subiendo a R2 con key:', key)
        
        await c.env.R2.put(key, new Uint8Array(arrayBuf), {
          httpMetadata: { contentType: file.type }
        })
        
        console.log('✅ Archivo subido exitosamente a R2')
        
        // Construir URL pública servida por el propio worker (/media) para que funcione en desarrollo y producción
        const origin = new URL(c.req.url).origin
        const url = `${origin}/media/${key}`
        
        console.log('🔗 URL generada:', url)
        uploadUrls.push(url)
        
      } catch (r2Error) {
        console.error('💥 Error subiendo a R2:', r2Error)
        return c.json({ error: `Error subiendo imagen: ${r2Error.message}` }, 500)
      }
    }
    
    console.log('📋 URLs finales:', uploadUrls)

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

// GET /products/:id - Obtener producto específico
products.get('/:id', async (c) => {
  try {
    const productId = c.req.param('id')
    const tenantId = c.req.query('tenantId')

    if (!tenantId) {
      return c.json({
        error: 'Tenant requerido'
      }, 400)
    }

    if (!productId) {
      return c.json({
        error: 'Producto requerido'
      }, 400)
    }

    const supabase = c.get('supabase')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !data) {
      return c.json({
        error: 'Producto no encontrado'
      }, 404)
    }

    if (data.status !== 'active' || (data.stock !== undefined && data.stock <= 0)) {
      return c.json({
        error: 'Producto no disponible'
      }, 404)
    }

    return c.json({
      success: true,
      product: data
    })
  } catch (error) {
    console.error('Get product error:', error)
    return c.json({
      error: 'Error al obtener producto'
    }, 500)
  }
})

// PUT /products/:id - Actualizar producto
products.put('/:id', async (c) => {
  try {
    const productId = c.req.param('id')
    const body = await c.req.json()
    
    // Schema para actualización
    const updateSchema = z.object({
      tenantId: z.string().uuid('Tenant inválido'),
      name: z.string().min(2, 'Nombre requerido').optional(),
      description: z.string().optional(),
      price: z.number().positive('Precio debe ser positivo').optional(),
      category: z.string().min(1, 'Categoría requerida').optional(),
      stock: z.number().int().min(0, 'Stock no puede ser negativo').optional(),
      status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
    })
    
    const validatedData = updateSchema.parse(body)
    
    // Verificar que el producto pertenece al tenant
    const supabase = c.get('supabase')
    const { data: existing, error: existingError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('tenant_id', validatedData.tenantId)
      .single()
    
    if (existingError || !existing) {
      return c.json({
        error: 'Producto no encontrado'
      }, 404)
    }
    
    // Actualizar producto
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.price !== undefined) updateData.price = validatedData.price
    if (validatedData.category) updateData.category = validatedData.category
    if (validatedData.stock !== undefined) updateData.stock = validatedData.stock
    if (validatedData.status) updateData.status = validatedData.status
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .eq('tenant_id', validatedData.tenantId)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase update product error:', error)
      return c.json({
        error: 'Error al actualizar producto'
      }, 500)
    }
    
    return c.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product: data
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Update product error:', error)
    return c.json({
      error: 'Error al actualizar producto'
    }, 500)
  }
})

// DELETE /products/:id - Eliminar producto
products.delete('/:id', async (c) => {
  try {
    const productId = c.req.param('id')
    const tenantId = c.req.query('tenantId')
    
    if (!tenantId) {
      return c.json({
        error: 'Tenant requerido'
      }, 400)
    }
    
    const supabase = c.get('supabase')
    
    // Verificar que el producto existe y pertenece al tenant
    const { data: existing, error: existingError } = await supabase
      .from('products')
      .select('id, images')
      .eq('id', productId)
      .eq('tenant_id', tenantId)
      .single()
    
    if (existingError || !existing) {
      return c.json({
        error: 'Producto no encontrado'
      }, 404)
    }
    
    // TODO: Eliminar imágenes de R2 si es necesario
    // if (existing.images && Array.isArray(existing.images)) {
    //   for (const imageUrl of existing.images) {
    //     try {
    //       const key = imageUrl.split('/media/')[1]
    //       if (key) {
    //         await c.env.R2.delete(key)
    //       }
    //     } catch (r2Error) {
    //       console.error('Error eliminando imagen de R2:', r2Error)
    //     }
    //   }
    // }
    
    // Eliminar producto
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Supabase delete product error:', error)
      return c.json({
        error: 'Error al eliminar producto'
      }, 500)
    }
    
    return c.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
    
  } catch (error) {
    console.error('Delete product error:', error)
    return c.json({
      error: 'Error al eliminar producto'
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
