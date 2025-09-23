import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const vision = new Hono<{ Bindings: Env }>()

// Schema para análisis de imagen
const visionSchema = z.object({
  imageUrl: z.string().url('URL de imagen inválida'),
  userQuery: z.string().optional(),
  tenantId: z.string().optional()
})

// POST /vision - Análisis de imagen para búsqueda de productos
vision.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = visionSchema.parse(body)
    
    // TODO: Implementar budget guard para visión
    // const guard = await budgetGuard(c, 'vision')
    // if (!guard.allowed) return fallback response
    
    const systemPrompt = {
      role: 'system',
      content: 'Eres un extractor. Devuelve JSON con brand, product_type, model_guess, color, size_guess (si aplica), query y confidence (0..1). No agregues texto fuera del JSON.'
    }
    
    const userPrompt = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: validatedData.userQuery || 'Detecta marca/modelo/color del producto en la imagen.'
        },
        {
          type: 'image_url',
          image_url: {
            url: validatedData.imageUrl
          }
        }
      ]
    }
    
    const response = await fetch(`${c.env.OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': c.env.OPENROUTER_SITE_URL,
        'X-Title': c.env.OPENROUTER_APP_NAME
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 220,
        messages: [systemPrompt, userPrompt],
        response_format: { type: 'json_object' }
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }
    
    const data = await response.json() as any
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in response')
    }
    
    const extractedData = JSON.parse(content)
    
    return c.json({
      success: true,
      extraction: extractedData,
      model: 'gpt-4o-mini',
      usage: data.usage
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Vision error:', error)
    return c.json({
      error: 'Error al analizar imagen',
      message: 'No se pudo procesar la imagen. Intenta con otra.'
    }, 500)
  }
})

export default vision
