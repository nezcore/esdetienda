import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'
import { verifyPasswordPBKDF2, hashPasswordPBKDF2 } from '../utils/password'

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

    // Verificar contraseña (soportar texto plano legado o PBKDF2)
    let passwordOk = false
    if (typeof user.password_hash === 'string' && user.password_hash.startsWith('pbkdf2$')) {
      passwordOk = await verifyPasswordPBKDF2(validatedData.password, user.password_hash)
    } else {
      passwordOk = user.password_hash === validatedData.password
    }

    if (!passwordOk) {
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

// Utilidad para extraer userId de nuestro token mock: jwt_<userId>_<timestamp>
function getUserIdFromAuthHeader(c: any): string | null {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length)
  if (!token.startsWith('jwt_')) return null
  const parts = token.split('_')
  return parts.length >= 3 ? parts[1] : null
}

// PUT /auth/email - Actualizar email del usuario autenticado (requiere contraseña actual)
auth.put('/email', async (c) => {
  try {
    const body = await c.req.json()
    const schema = z.object({
      newEmail: z.string().email('Email inválido'),
      currentPassword: z.string().min(8)
    })
    const { newEmail, currentPassword } = schema.parse(body)

    const userId = getUserIdFromAuthHeader(c)
    if (!userId) return c.json({ error: 'No autorizado' }, 401)

    const supabase = c.get('supabase')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id,email,password_hash')
      .eq('id', userId)
      .maybeSingle()

    if (userError || !user) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    let passwordOk = false
    if (typeof user.password_hash === 'string' && user.password_hash.startsWith('pbkdf2$')) {
      passwordOk = await verifyPasswordPBKDF2(currentPassword, user.password_hash)
    } else {
      passwordOk = user.password_hash === currentPassword
    }
    if (!passwordOk) return c.json({ error: 'Contraseña actual incorrecta' }, 400)

    const { error: updateError } = await supabase
      .from('users')
      .update({ email: newEmail })
      .eq('id', userId)

    if (updateError) {
      return c.json({ error: 'No se pudo actualizar el email' }, 500)
    }

    return c.json({ success: true, message: 'Email actualizado' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Datos inválidos', details: error.errors }, 400)
    }
    return c.json({ error: 'Error al actualizar email' }, 500)
  }
})

// PUT /auth/password - Actualizar contraseña del usuario autenticado
auth.put('/password', async (c) => {
  try {
    const body = await c.req.json()
    const schema = z.object({
      currentPassword: z.string().min(8),
      newPassword: z.string().min(8)
    })
    const { currentPassword, newPassword } = schema.parse(body)

    const userId = getUserIdFromAuthHeader(c)
    if (!userId) return c.json({ error: 'No autorizado' }, 401)

    const supabase = c.get('supabase')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id,password_hash')
      .eq('id', userId)
      .maybeSingle()

    if (userError || !user) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }

    let passwordOk = false
    if (typeof user.password_hash === 'string' && user.password_hash.startsWith('pbkdf2$')) {
      passwordOk = await verifyPasswordPBKDF2(currentPassword, user.password_hash)
    } else {
      passwordOk = user.password_hash === currentPassword
    }
    if (!passwordOk) return c.json({ error: 'Contraseña actual incorrecta' }, 400)

    // Guardar en hash PBKDF2 (mejora seguridad sin romper login legacy)
    const hashed = await hashPasswordPBKDF2(newPassword)
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashed })
      .eq('id', userId)

    if (updateError) {
      return c.json({ error: 'No se pudo actualizar la contraseña' }, 500)
    }

    return c.json({ success: true, message: 'Contraseña actualizada' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Datos inválidos', details: error.errors }, 400)
    }
    return c.json({ error: 'Error al actualizar contraseña' }, 500)
  }
})
