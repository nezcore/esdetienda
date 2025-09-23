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
    
    // TODO: Implementar autenticación real con MongoDB
    // Por ahora, simular login exitoso
    const mockUser = {
      id: 'user_123',
      email: validatedData.email,
      tenantId: 'tenant_demo',
      role: 'admin'
    }
    
    // TODO: Generar JWT real
    const token = 'mock_jwt_token'
    
    return c.json({
      success: true,
      token,
      user: mockUser
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
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
    
    // TODO: Verificar que el tenantSlug no exista
    // TODO: Crear usuario en MongoDB
    // TODO: Crear tenant en MongoDB
    // TODO: Configurar stripe/payment si está habilitado
    
    // Por ahora, simular registro exitoso
    const newUser = {
      id: `user_${Date.now()}`,
      email: validatedData.email,
      tenantId: `tenant_${validatedData.tenantSlug}`,
      role: 'admin'
    }
    
    const newTenant = {
      id: newUser.tenantId,
      slug: validatedData.tenantSlug,
      businessName: validatedData.businessName,
      plan: validatedData.plan,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    // TODO: Enviar email de bienvenida
    // TODO: Generar JWT real
    const token = 'mock_jwt_token'
    
    return c.json({
      success: true,
      message: 'Cuenta creada exitosamente',
      token,
      user: newUser,
      tenant: newTenant
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
