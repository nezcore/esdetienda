import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const tenants = new Hono<{ Bindings: Env }>()

// Schema para crear tenant
const createTenantSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug debe contener solo letras minúsculas, números y guiones'),
  businessName: z.string().min(2, 'Nombre de negocio requerido'),
  plan: z.enum(['esencial', 'pro']),
  ownerEmail: z.string().email('Email inválido'),
  settings: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    whatsappNumber: z.string().optional(),
    description: z.string().optional()
  }).optional()
})

// POST /tenants - Crear nuevo tenant (solo admin)
tenants.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = createTenantSchema.parse(body)
    
    // TODO: Verificar autenticación de admin
    // TODO: Verificar que el slug no exista en MongoDB
    
    // Verificar slug único en KV (cache rápido)
    const existingSlug = await c.env.KV.get(`tenant:slug:${validatedData.slug}`)
    if (existingSlug) {
      return c.json({
        error: 'Slug ya existe',
        message: `El slug '${validatedData.slug}' ya está en uso`
      }, 409)
    }
    
    // TODO: Crear tenant en MongoDB
    const newTenant = {
      id: `tenant_${validatedData.slug}`,
      slug: validatedData.slug,
      businessName: validatedData.businessName,
      plan: validatedData.plan,
      status: 'active',
      settings: {
        primaryColor: '#134572',
        secondaryColor: '#27A3A4',
        whatsappNumber: '',
        description: validatedData.businessName,
        ...validatedData.settings
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Guardar en KV para acceso rápido
    await c.env.KV.put(`tenant:slug:${validatedData.slug}`, JSON.stringify(newTenant))
    await c.env.KV.put(`tenant:${newTenant.id}`, JSON.stringify(newTenant))
    
    return c.json({
      success: true,
      message: 'Tenant creado exitosamente',
      tenant: newTenant
    }, 201)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Create tenant error:', error)
    return c.json({
      error: 'Error al crear tenant'
    }, 500)
  }
})

// GET /tenants/slug/:slug - Verificar si un slug está disponible
tenants.get('/slug/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    
    if (!slug) {
      return c.json({
        error: 'Slug requerido'
      }, 400)
    }
    
    const supabase = c.get('supabase')
    
    // Verificar si el slug existe en la base de datos
    const { data: existingTenant, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    
    if (error) {
      console.error('Supabase slug check error:', error)
      return c.json({ error: 'Error al verificar slug' }, 500)
    }
    
    // Si existe, no está disponible
    if (existingTenant) {
      return c.json({
        available: false,
        message: 'Slug no disponible'
      })
    }
    
    // Si no existe, está disponible
    return c.json({
      available: true,
      message: 'Slug disponible'
    })
    
  } catch (error) {
    console.error('Check slug error:', error)
    return c.json({
      error: 'Error al verificar slug'
    }, 500)
  }
})

// GET /tenants/:slug - Obtener información pública del tenant
tenants.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    
    if (!slug) {
      return c.json({
        error: 'Slug requerido'
      }, 400)
    }
    
    // Buscar en Supabase
    const supabase = c.get('supabase')
    const { data: tenantData, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !tenantData) {
      // Si no existe, crear tenant demo para ciertos slugs
      if (slug === 'demo' || slug === 'ferreteriacarlos') {
        const demoTenant = {
          id: `tenant_${slug}`,
          slug: slug,
          business_name: slug === 'demo' ? 'Tienda Demo' : 'Ferretería Carlos',
          plan: 'pro',
          status: 'active',
          description: slug === 'demo' 
            ? 'Tienda de demostración para EsDeTienda' 
            : 'Todo en ferretería y construcción para tu hogar y proyecto.',
          primary_color: '#134572',
          secondary_color: '#27A3A4',
          whatsapp_number: '+1-809-555-0123'
        }
        
        // Crear tenant en Supabase
        const { data: newTenant, error: createError } = await supabase
          .from('tenants')
          .insert(demoTenant)
          .select()
          .single()
        
        if (createError) {
          console.error('Error creating demo tenant:', createError)
          return c.json({
            error: 'Tienda no encontrada',
            message: `La tienda '${slug}' no existe`
          }, 404)
        }
        
        return c.json({
          success: true,
          tenant: {
            id: newTenant.id,
            slug: newTenant.slug,
            business_name: newTenant.business_name,
            plan: newTenant.plan,
            status: newTenant.status,
            description: newTenant.description,
            colors: {
              primary: newTenant.primary_color || '#134572',
              secondary: newTenant.secondary_color || '#27A3A4'
            },
            whatsappNumber: newTenant.whatsapp_number
          }
        })
      }
    }
    
    if (!tenantData) {
      return c.json({
        error: 'Tienda no encontrada',
        message: `La tienda '${slug}' no existe`
      }, 404)
    }
    
    // Solo devolver información pública
    const publicTenantInfo = {
      id: tenantData.id,
      slug: tenantData.slug,
      business_name: tenantData.business_name,
      plan: tenantData.plan,
      status: tenantData.status,
      description: tenantData.description,
      logo: tenantData.logo,
      icon: tenantData.icon,
      colors: {
        primary: tenantData.primary_color || '#134572',
        secondary: tenantData.secondary_color || '#27A3A4'
      },
      whatsappNumber: tenantData.whatsapp_number
    }
    
    return c.json({
      success: true,
      tenant: publicTenantInfo
    })
    
  } catch (error) {
    console.error('Get tenant error:', error)
    return c.json({
      error: 'Error al obtener información del tenant'
    }, 500)
  }
})

// Schema para actualizar tenant
const updateTenantSchema = z.object({
  business_name: z.string().min(2, 'Nombre de negocio requerido').optional(),
  description: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  whatsapp_number: z.string().optional(),
  logo: z.string().optional(),
  icon: z.string().optional()
})

// PUT /tenants/:slug - Actualizar configuración del tenant (solo owner)
tenants.put('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json()
    
    if (!slug) {
      return c.json({
        error: 'Slug requerido'
      }, 400)
    }
    
    // Validar datos de entrada
    const validatedData = updateTenantSchema.parse(body)
    
    const supabase = c.get('supabase')
    
    // Verificar que el tenant existe
    const { data: existingTenant, error: fetchError } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (fetchError || !existingTenant) {
      return c.json({
        error: 'Tienda no encontrada'
      }, 404)
    }
    
    // Actualizar tenant en Supabase
    const { data: updatedTenant, error: updateError } = await supabase
      .from('tenants')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single()
    
    if (updateError) {
      console.error('Supabase update error:', updateError)
      return c.json({
        error: 'Error al actualizar la tienda'
      }, 500)
    }
    
    // Devolver información pública actualizada
    const publicTenantInfo = {
      id: updatedTenant.id,
      slug: updatedTenant.slug,
      business_name: updatedTenant.business_name,
      plan: updatedTenant.plan,
      status: updatedTenant.status,
      description: updatedTenant.description,
      logo: updatedTenant.logo,
      icon: updatedTenant.icon,
      colors: {
        primary: updatedTenant.primary_color || '#134572',
        secondary: updatedTenant.secondary_color || '#27A3A4'
      },
      whatsappNumber: updatedTenant.whatsapp_number
    }
    
    return c.json({
      success: true,
      tenant: publicTenantInfo,
      message: 'Tienda actualizada exitosamente'
    })
    
  } catch (error) {
    console.error('Update tenant error:', error)
    
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    return c.json({
      error: 'Error al actualizar tenant'
    }, 500)
  }
})

// DELETE /tenants/:slug - Eliminar tenant (solo admin)
tenants.delete('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    
    // TODO: Verificar autenticación de admin
    // TODO: Eliminar de MongoDB
    // TODO: Limpiar cache de KV
    // TODO: Limpiar archivos de R2
    
    return c.json({
      success: true,
      message: 'Tenant eliminado exitosamente'
    })
    
  } catch (error) {
    console.error('Delete tenant error:', error)
    return c.json({
      error: 'Error al eliminar tenant'
    }, 500)
  }
})

export default tenants
