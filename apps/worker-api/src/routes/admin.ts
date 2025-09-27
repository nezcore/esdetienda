import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'
import { verifyPasswordPBKDF2 } from '../utils/password'

// Función para generar mensajes de error aleatorios de autenticación admin
function getRandomAdminAuthErrorMessage(): string {
  const messages = [
    'Acceso denegado, verifica tus credenciales',
    'Datos incorrectos para acceso administrativo',
    'Error de autenticación de superadmin',
    'Credenciales de administrador incorrectas',
    'Ups, acceso no autorizado. Revisa tus datos',
    'No tienes permisos o tus datos son incorrectos',
    'Acceso restringido, verifica tu información',
    'Error de validación de administrador'
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

// Función para generar mensajes amigables de errores de validación admin
function getAdminValidationErrorMessage(zodErrors: z.ZodIssue[]): string {
  const firstError = zodErrors[0]
  
  // Manejo específico para diferentes tipos de errores
  if (firstError.path.includes('password')) {
    if (firstError.code === 'too_small') {
      return 'La contraseña de administrador debe tener al menos 8 caracteres'
    }
  }
  
  if (firstError.path.includes('email')) {
    if (firstError.code === 'invalid_string') {
      return 'Por favor ingresa un email de administrador válido'
    }
  }
  
  // Mensajes genéricos más amigables para admin
  const friendlyMessages = [
    'Error en los datos de acceso administrativo',
    'Verifica la información de administrador',
    'Hay un problema con los datos ingresados'
  ]
  
  return friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)]
}

const admin = new Hono<{ Bindings: Env }>()

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// POST /admin/login - autenticación de superadmin
admin.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const data = adminLoginSchema.parse(body)

    const supabase = c.get('supabase')
    const { data: adminUser, error } = await supabase
      .from('platform_admins')
      .select('id, email, password_hash, role, status')
      .eq('email', data.email)
      .maybeSingle()

    if (error || !adminUser || adminUser.status !== 'active') {
      return c.json({ 
        error: 'Error de autenticación',
        message: getRandomAdminAuthErrorMessage()
      }, 401)
    }
    // Verificar contraseña
    const ok = await verifyPasswordPBKDF2(data.password, adminUser.password_hash)
    if (!ok) {
      return c.json({ 
        error: 'Error de autenticación',
        message: getRandomAdminAuthErrorMessage()
      }, 401)
    }

    // TODO: Generar JWT separado para admins
    const token = `admin_${adminUser.id}_${Date.now()}`

    return c.json({
      success: true,
      token,
      admin: { id: adminUser.id, email: adminUser.email, role: adminUser.role }
    })
  } catch (err) {
    if (err instanceof z.ZodError) return c.json({ 
      error: 'Error de validación', 
      message: getAdminValidationErrorMessage(err.errors) 
    }, 400)
    return c.json({ 
      error: 'Error de autenticación',
      message: getRandomAdminAuthErrorMessage()
    }, 500)
  }
})

// GET /admin/stats - estadísticas generales
admin.get('/stats', async (c) => {
  try {
    const supabase = c.get('supabase')

    const [{ count: tenants }, { count: users }, { count: products }] = await Promise.all([
      supabase.from('tenants').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true })
    ])

    return c.json({ tenants: tenants ?? 0, users: users ?? 0, products: products ?? 0 })
  } catch (err) {
    return c.json({ error: 'Error obteniendo estadísticas' }, 500)
  }
})

// GET /admin/tenants - listado de tiendas
admin.get('/tenants', async (c) => {
  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('tenants')
    .select('id, slug, business_name, plan, status, created_at')
    .order('created_at', { ascending: false })
  if (error) return c.json({ error: 'Error listando tenants' }, 500)
  return c.json({ items: data })
})

// GET /admin/users - listado de usuarios
admin.get('/users', async (c) => {
  const supabase = c.get('supabase')
  const { data, error } = await supabase
    .from('users')
    .select('id, email, tenant_id, role, status, created_at')
    .order('created_at', { ascending: false })
  if (error) return c.json({ error: 'Error listando usuarios' }, 500)
  return c.json({ items: data })
})

// POST /admin/tenants/:id/plan - cambiar plan
admin.post('/tenants/:id/plan', async (c) => {
  const tenantId = c.req.param('id')
  const body = await c.req.json()
  const schema = z.object({ plan: z.enum(['esencial', 'pro', 'grow']).optional(), status: z.enum(['active','inactive','suspended']).optional() })
  const data = schema.parse(body)
  const supabase = c.get('supabase')
  const { error } = await supabase.from('tenants').update(data).eq('id', tenantId)
  if (error) return c.json({ error: 'Error actualizando tenant' }, 500)
  return c.json({ success: true })
})

export default admin


