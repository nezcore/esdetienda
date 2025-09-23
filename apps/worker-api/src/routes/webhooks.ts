import { Hono } from 'hono'
import { Env } from '../index'

const webhooks = new Hono<{ Bindings: Env }>()

// POST /webhook/whatsapp - Webhook de WhatsApp Cloud API
webhooks.post('/whatsapp', async (c) => {
  try {
    // Verificar token de verificación (webhook setup)
    const mode = c.req.query('hub.mode')
    const token = c.req.query('hub.verify_token')
    const challenge = c.req.query('hub.challenge')
    
    if (mode === 'subscribe' && token === 'WHATSAPP_VERIFY_TOKEN') {
      console.log('WhatsApp webhook verified')
      return c.text(challenge || 'OK')
    }
    
    // Procesar mensajes entrantes
    const body = await c.req.json()
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2))
    
    // TODO: Procesar mensajes de WhatsApp
    // TODO: Extraer número del remitente y mensaje
    // TODO: Determinar tenant por número de WhatsApp
    // TODO: Procesar con bot (botones -> IA fallback)
    // TODO: Responder via WhatsApp API
    
    return c.json({ status: 'received' })
    
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
})

export default webhooks
