import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const auth = new Hono<{ Bindings: Env }>()

// Schema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

// Schema para registro
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  businessName: z.string().min(2, 'Nombre de negocio requerido'),
  tenantSlug: z.string().regex(/^[a-z0-9-]+$/, 'Slug debe contener solo letras minúsculas, números y guiones'),
  plan: z.enum(['esencial', 'pro'])
})

// POST /auth/login - Autenticación de usuario
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = loginSchema.parse(body)
    
    const supabase = c.get('supabase')

    // Buscar usuario por email e incluir información del tenant
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        password_hash,
        tenant_id,
        role,
        status,
        tenants (
          id,
          slug,
          business_name,
          plan,
          status
        )
      `)
      .eq('email', validatedData.email)
      .eq('status', 'active')
      .maybeSingle()

    if (userError) {
      console.error('Supabase user lookup error:', userError)
      return c.json({
        error: 'Error de autenticación',
        message: 'Email o contraseña incorrectos'
      }, 401)
    }

    // Si no existe el usuario o no tiene tenant activo
    if (!user || !user.tenants || user.tenants.status !== 'active') {
      return c.json({
        error: 'Error de autenticación',
        message: 'Email o contraseña incorrectos'
      }, 401)
    }

    // Verificar contraseña (por ahora comparación directa, TODO: hash real)
    if (user.password_hash !== validatedData.password) {
      return c.json({
        error: 'Error de autenticación',
        message: 'Email o contraseña incorrectos'
      }, 401)
    }

    // TODO: Generar JWT real
    const token = `jwt_${user.id}_${Date.now()}`
    
    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      tenant: {
        id: user.tenants.id,
        slug: user.tenants.slug,
        business_name: user.tenants.business_name,
        plan: user.tenants.plan,
        status: user.tenants.status
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Login error:', error)
    return c.json({
      error: 'Error de autenticación',
      message: 'Email o contraseña incorrectos'
    }, 401)
  }
})

// POST /auth/register - Registro de nuevo usuario/tenant
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = registerSchema.parse(body)
    
    const supabase = c.get('supabase')

    // Verificar que el tenantSlug no exista
    const { data: existingTenant, error: existingTenantError } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', validatedData.tenantSlug)
      .maybeSingle()

    if (existingTenantError) {
      console.error('Supabase tenant check error:', existingTenantError)
      return c.json({ error: 'Error al validar el slug' }, 500)
    }

    if (existingTenant) {
      return c.json({
        error: 'Slug ya existe',
        message: `El slug '${validatedData.tenantSlug}' ya está en uso`
      }, 409)
    }

    // Crear tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        slug: validatedData.tenantSlug,
        business_name: validatedData.businessName,
        plan: validatedData.plan,
        status: 'active'
      })
      .select('*')
      .single()

    if (tenantError) {
      console.error('Supabase tenant create error:', tenantError)
      return c.json({ error: 'Error al crear la tienda' }, 500)
    }

    // Crear usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: validatedData.email,
        password_hash: validatedData.password, // TODO: hash real
        tenant_id: tenant.id,
        role: 'admin'
      })
      .select('*')
      .single()

    if (userError) {
      console.error('Supabase user create error:', userError)
      return c.json({ error: 'Error al crear el usuario' }, 500)
    }

    // TODO: Generar JWT real
    const token = 'mock_jwt_token'
    
    return c.json({
      success: true,
      message: 'Cuenta creada exitosamente',
      token,
      user,
      tenant
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Register error:', error)
    return c.json({
      error: 'Error en el registro',
      message: 'No se pudo crear la cuenta. Intenta de nuevo.'
    }, 500)
  }
})

// POST /auth/logout - Cerrar sesión
auth.post('/logout', async (c) => {
  // TODO: Invalidar JWT si estamos usando una blacklist
  
  return c.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  })
})

// GET /auth/me - Obtener información del usuario actual
auth.get('/me', async (c) => {
  // TODO: Implementar middleware de autenticación JWT
  // Por ahora, devolver usuario mock
  
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      error: 'Token de autorización requerido'
    }, 401)
  }
  
  // TODO: Validar JWT y obtener usuario real
  const mockUser = {
    id: 'user_123',
    email: 'admin@esdetienda.com',
    tenantId: 'tenant_demo',
    role: 'admin'
  }
  
  return c.json({
    success: true,
    user: mockUser
  })
})

export default auth
