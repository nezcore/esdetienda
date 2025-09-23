import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = (err: Error, c: Context) => {
  console.error('API Error:', {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString()
  })

  // Si es una HTTPException de Hono
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message,
      status: err.status,
      timestamp: new Date().toISOString()
    }, err.status)
  }

  // Error genérico
  return c.json({
    error: 'Error interno del servidor',
    message: c.env?.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error',
    timestamp: new Date().toISOString()
  }, 500)
}
