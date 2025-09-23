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
    })\n    \n    if (!response.ok) {\n      const errorData = await response.text()\n      console.error('OpenRouter API error:', {\n        status: response.status,\n        statusText: response.statusText,\n        body: errorData\n      })\n      \n      return c.json({\n        error: 'Error en el servicio de IA',\n        message: 'No se pudo procesar la consulta. Intenta de nuevo.',\n        fallback: true\n      }, 503)\n    }\n    \n    const data = await response.json() as any\n    \n    // Calcular costo real basado en tokens devueltos por la API\n    let actualInputTokens = data.usage?.prompt_tokens || estimatedInputTokens\n    let actualOutputTokens = data.usage?.completion_tokens || estimatedOutputTokens\n    let actualCost = (actualInputTokens * PRICE_IN) + (actualOutputTokens * PRICE_OUT)\n    \n    // Si no tenemos usage de la API, usar heurística\n    if (!data.usage && data.choices?.[0]?.message?.content) {\n      actualOutputTokens = estimateTokens(data.choices[0].message.content)\n      actualCost = (estimatedInputTokens * PRICE_IN) + (actualOutputTokens * PRICE_OUT)\n    }\n    \n    // Actualizar consumo\n    await updateUsage(c, guard.key, guard.used, actualCost)\n    \n    return c.json({\n      success: true,\n      response: data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.',\n      usage: {\n        inputTokens: actualInputTokens,\n        outputTokens: actualOutputTokens,\n        estimatedCost: actualCost,\n        remainingBudget: guard.cap - guard.used - actualCost\n      },\n      model: 'gpt-5-nano'\n    })\n    \n  } catch (error) {\n    if (error instanceof z.ZodError) {\n      return c.json({\n        error: 'Datos inválidos',\n        details: error.errors\n      }, 400)\n    }\n    \n    console.error('Chat error:', error)\n    return c.json({\n      error: 'Error en la conversación',\n      message: 'No se pudo procesar tu mensaje. Intenta de nuevo.',\n      fallback: true\n    }, 500)\n  }\n})\n\n// GET /chat/budget - Obtener estado del presupuesto\nchat.get('/budget', async (c) => {\n  try {\n    const now = new Date()\n    const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`\n    \n    const nanoKey = `quota:${ym}:nano`\n    const visionKey = `quota:${ym}:vision`\n    \n    const [nanoData, visionData] = await Promise.all([\n      c.env.KV.get(nanoKey, 'json') as Promise<{ usd: number } | null>,\n      c.env.KV.get(visionKey, 'json') as Promise<{ usd: number } | null>\n    ])\n    \n    const nanoCap = Number(c.env.IA_NANO_BUDGET_USD || '25')\n    const visionCap = Number(c.env.IA_VISION_BUDGET_USD || '10')\n    \n    const nanoUsed = nanoData?.usd || 0\n    const visionUsed = visionData?.usd || 0\n    \n    return c.json({\n      success: true,\n      month: ym,\n      nano: {\n        used: nanoUsed,\n        cap: nanoCap,\n        remaining: nanoCap - nanoUsed,\n        percentage: Math.round((nanoUsed / nanoCap) * 100)\n      },\n      vision: {\n        used: visionUsed,\n        cap: visionCap,\n        remaining: visionCap - visionUsed,\n        percentage: Math.round((visionUsed / visionCap) * 100)\n      },\n      total: {\n        used: nanoUsed + visionUsed,\n        cap: nanoCap + visionCap,\n        remaining: (nanoCap + visionCap) - (nanoUsed + visionUsed)\n      }\n    })\n    \n  } catch (error) {\n    console.error('Budget check error:', error)\n    return c.json({\n      error: 'Error al verificar presupuesto'\n    }, 500)\n  }\n})\n\nexport default chat"}]
