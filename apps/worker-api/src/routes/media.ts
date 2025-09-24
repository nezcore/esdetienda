import { Hono } from 'hono'
import { Env } from '../index'

const media = new Hono<{ Bindings: Env }>()

// Servir objetos desde R2: /media/<key>
media.get('/:rest{.*}', async (c) => {
  try {
    const key = c.req.param('rest')
    if (!key) return c.text('Not Found', 404)

    const obj = await c.env.R2.get(key)
    if (!obj) return c.text('Not Found', 404)

    const headers = new Headers()
    const ct = obj.httpMetadata?.contentType || 'application/octet-stream'
    headers.set('Content-Type', ct)
    if (obj.httpMetadata?.cacheExpiry) {
      headers.set('Cache-Control', `public, max-age=${obj.httpMetadata.cacheExpiry}`)
    } else {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return new Response(obj.body, { headers })
  } catch (e) {
    return c.text('Error', 500)
  }
})

export default media


