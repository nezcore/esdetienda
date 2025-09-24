import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const chat = new Hono<{ Bindings: Env }>()

// Precios por token de OpenRouter para gpt-5-nano
const PRICE_IN = 0.05 / 1_000_000   // USD/token input
const PRICE_OUT = 0.40 / 1_000_000  // USD/token output

// Schema para chat
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })),
  tenantId: z.string().optional(),
  maxTokens: z.number().min(50).max(200).optional().default(160)
})

// Función para guardar en budget guard
async function budgetGuard(c: any, model: 'nano' | 'vision', estIn = 250, estOut = 120) {
  const now = new Date()
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const key = `quota:${ym}:${model}`
  
  const raw = await c.env.KV.get(key, 'json') as { usd: number } | null
  const cap = model === 'nano' 
    ? Number(c.env.IA_NANO_BUDGET_USD || '25') 
    : Number(c.env.IA_VISION_BUDGET_USD || '10')
    
  const estCost = model === 'nano' ? (estIn * PRICE_IN + estOut * PRICE_OUT) : 0
  const used = raw?.usd || 0
  
  if (used + estCost > cap) {
    return { allowed: false, used, cap, key }
  }
  
  return { allowed: true, key, used, cap, estCost }
}

// Función para estimar tokens (heurística simple)
function estimateTokens(text: string): number {
  // Aproximación: 1 token ≈ 4 caracteres en español
  return Math.ceil(text.length / 4)
}

// Función para actualizar consumo
async function updateUsage(c: any, key: string, currentUsed: number, actualCost: number) {
  const newUsed = currentUsed + actualCost
  // TTL de 40 días para que persista el mes completo
  await c.env.KV.put(key, JSON.stringify({ usd: newUsed }), { 
    expirationTtl: 60 * 60 * 24 * 40 
  })
  
  // Verificar si alcanzamos 80% del presupuesto para alerta
  const cap = Number(c.env.IA_NANO_BUDGET_USD || '25')
  if (newUsed >= cap * 0.8 && currentUsed < cap * 0.8) {
    console.warn(`Budget alert: IA Nano usage is at ${((newUsed/cap)*100).toFixed(1)}% (${newUsed.toFixed(2)}/${cap} USD)`)
    // TODO: Enviar email de alerta al ALERT_EMAIL
  }
}

// POST /chat - Conversación con IA (gpt-5-nano)
chat.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = chatSchema.parse(body)
    
    // Estimar tokens de entrada
    const inputText = validatedData.messages.map(m => m.content).join(' ')
    const estimatedInputTokens = estimateTokens(inputText)
    const estimatedOutputTokens = validatedData.maxTokens
    
    // Verificar presupuesto
    const guard = await budgetGuard(c, 'nano', estimatedInputTokens, estimatedOutputTokens)
    
    if (!guard.allowed) {
      return c.json({
        fallback: true,
        message: "Estoy un poco ocupado, ¿puedes describirlo con otras palabras o usar los botones?",
        budgetInfo: {
          used: guard.used,
          cap: guard.cap,
          percentage: Math.round((guard.used / guard.cap) * 100)
        }
      }, 200)
    }
    
    // Llamar a OpenRouter
    const response = await fetch(`${c.env.OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': c.env.OPENROUTER_SITE_URL,
        'X-Title': c.env.OPENROUTER_APP_NAME
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-nano',
        max_tokens: validatedData.maxTokens,
        messages: validatedData.messages,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      })

      return c.json({
        error: 'Error en el servicio de IA',
        message: 'No se pudo procesar la consulta. Intenta de nuevo.',
        fallback: true
      }, 503)
    }
    
    const data = await response.json() as any
    
    // Calcular costo real basado en tokens devueltos por la API
    let actualInputTokens = data.usage?.prompt_tokens || estimatedInputTokens
    let actualOutputTokens = data.usage?.completion_tokens || estimatedOutputTokens
    let actualCost = (actualInputTokens * PRICE_IN) + (actualOutputTokens * PRICE_OUT)
    
    // Si no tenemos usage de la API, usar heurística
    if (!data.usage && data.choices?.[0]?.message?.content) {
      actualOutputTokens = estimateTokens(data.choices[0].message.content)
      actualCost = (estimatedInputTokens * PRICE_IN) + (actualOutputTokens * PRICE_OUT)
    }
    
    // Actualizar consumo
    await updateUsage(c, guard.key, guard.used, actualCost)
    
    return c.json({
      success: true,
      response: data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.',
      usage: {
        inputTokens: actualInputTokens,
        outputTokens: actualOutputTokens,
        estimatedCost: actualCost,
        remainingBudget: guard.cap - guard.used - actualCost
      },
      model: 'gpt-5-nano'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('Chat error:', error)
    return c.json({
      error: 'Error en la conversación',
      message: 'No se pudo procesar tu mensaje. Intenta de nuevo.',
      fallback: true
    }, 500)
  }
})

// GET /chat/budget - Obtener estado del presupuesto
chat.get('/budget', async (c) => {
  try {
    if (!c.env.KV) {
      return c.json({
        success: true,
        warning: 'KV no configurado todavía',
        nano: { used: 0, cap: Number(c.env.IA_NANO_BUDGET_USD || '25'), remaining: Number(c.env.IA_NANO_BUDGET_USD || '25'), percentage: 0 },
        vision: { used: 0, cap: Number(c.env.IA_VISION_BUDGET_USD || '10'), remaining: Number(c.env.IA_VISION_BUDGET_USD || '10'), percentage: 0 }
      })
    }

    const now = new Date()
    const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
    
    const nanoKey = `quota:${ym}:nano`
    const visionKey = `quota:${ym}:vision`
    
    const [nanoData, visionData] = await Promise.all([
      c.env.KV.get(nanoKey, 'json') as Promise<{ usd: number } | null>,
      c.env.KV.get(visionKey, 'json') as Promise<{ usd: number } | null>
    ])
    
    const nanoCap = Number(c.env.IA_NANO_BUDGET_USD || '25')
    const visionCap = Number(c.env.IA_VISION_BUDGET_USD || '10')
    
    const nanoUsed = nanoData?.usd || 0
    const visionUsed = visionData?.usd || 0
    
    return c.json({
      success: true,
      month: ym,
      nano: {
        used: nanoUsed,
        cap: nanoCap,
        remaining: nanoCap - nanoUsed,
        percentage: Math.round((nanoUsed / nanoCap) * 100)
      },
      vision: {
        used: visionUsed,
        cap: visionCap,
        remaining: visionCap - visionUsed,
        percentage: Math.round((visionUsed / visionCap) * 100)
      },
      total: {
        used: nanoUsed + visionUsed,
        cap: nanoCap + visionCap,
        remaining: (nanoCap + visionCap) - (nanoUsed + visionUsed)
      }
    })
    
  } catch (error) {
    console.error('Budget check error:', error)
    return c.json({
      error: 'Error al verificar presupuesto'
    }, 500)
  }
})

export default chat
