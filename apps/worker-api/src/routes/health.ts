import { Hono } from 'hono'
import { Env } from '../index'

const health = new Hono<{ Bindings: Env }>()

// GET /health - Health check básico
health.get('/health', async (c) => {
  const start = Date.now()
  
  try {
    // Test básico de KV (opcional)
    const kvTest = await c.env.KV?.get('health-check')
    
    const responseTime = Date.now() - start
    
    return c.json({
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: c.env.NODE_ENV || 'unknown',
      services: {
        kv: !!c.env.KV,
        r2: !!c.env.R2,
        database: !!c.env.SUPABASE_URL
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return c.json({
      ok: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: c.env.NODE_ENV === 'development' ? (error as Error).message : 'Service unavailable'
    }, 503)
  }
})

// GET / - Endpoint raíz
health.get('/', (c) => {
  return c.json({
    service: 'EsDeTienda API',
    version: '1.0.1',
    description: 'API Worker para plataforma SaaS multi-tenant',
    documentation: 'https://api.esdetienda.com/docs',
    timestamp: new Date().toISOString(),
    deployment: 'Auto-deploy desde GitHub activo! 🚀'
  })
})

export default health
