import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Routes
import healthRoute from './routes/health'
import authRoutes from './routes/auth'
import tenantRoutes from './routes/tenants'
import productRoutes from './routes/products'
import searchRoutes from './routes/search'
import chatRoutes from './routes/chat'
import visionRoutes from './routes/vision'
import sttRoutes from './routes/stt'
import webhookRoutes from './routes/webhooks'
import orderRoutes from './routes/orders'
import usageRoutes from './routes/usage'
import { getSupabaseAdminClient } from './lib/supabase'

// Middleware
import { errorHandler } from './middleware/error-handler'

// Tipos de entorno
export interface Env {
  // KV para caps y contadores
  KV: KVNamespace
  
  // R2 para medios
  R2: R2Bucket
  
  // Variables de entorno
  NODE_ENV: string
  
  // OpenRouter
  OPENROUTER_API_KEY: string
  OPENROUTER_API_URL: string
  OPENROUTER_SITE_URL: string
  OPENROUTER_APP_NAME: string
  
  // IA Budgets
  IA_NANO_BUDGET_USD: string
  IA_VISION_BUDGET_USD: string
  STT_MINUTES_CAP: string
  ALERT_EMAIL: string
  
  // STT
  STT_PROVIDER: string
  ASSEMBLYAI_API_KEY?: string
  GOOGLE_PROJECT_ID?: string
  GOOGLE_SA_EMAIL?: string
  GOOGLE_SA_PRIVATE_KEY?: string
  
  // Supabase
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
  
  // Analytics
  POSTHOG_API_KEY: string
  SENTRY_DSN: string
}

const app = new Hono<{ Bindings: Env }>()

// Middleware global
app.use('*', logger())
app.use('*', cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Deshabilitar credentials para permitir origin: *
}))

// Manejador de errores
app.onError(errorHandler)

// Inyección de cliente Supabase a request (debe ir ANTES de las rutas)
app.use('*', async (c, next) => {
  const client = getSupabaseAdminClient({
    url: c.env.SUPABASE_URL,
    serviceKey: c.env.SUPABASE_SERVICE_KEY
  })
  c.set('supabase', client)
  await next()
})

// Health check (sin prefijo para que funcione en el root)
app.route('/', healthRoute)

// Rutas de la API
app.route('/auth', authRoutes)
app.route('/tenants', tenantRoutes) 
app.route('/products', productRoutes)
app.route('/search', searchRoutes)
app.route('/chat', chatRoutes)
app.route('/vision', visionRoutes)
app.route('/stt', sttRoutes)
app.route('/webhook', webhookRoutes)
app.route('/orders', orderRoutes)
app.route('/usage', usageRoutes)

// Ruta de fallback
app.all('*', (c) => {
  return c.json({
    error: 'Endpoint no encontrado',
    message: `Ruta ${c.req.method} ${c.req.path} no está disponible`,
    timestamp: new Date().toISOString()
  }, 404)
})

export default app
