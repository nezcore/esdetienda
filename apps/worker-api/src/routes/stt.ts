import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const stt = new Hono<{ Bindings: Env }>()

// Schema para STT
const sttSchema = z.object({
  audioUrl: z.string().url('URL de audio inválida'),
  tenantId: z.string().optional()
})

// POST /stt - Speech to Text
stt.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = sttSchema.parse(body)
    
    const provider = c.env.STT_PROVIDER || 'assemblyai'
    
    if (provider === 'assemblyai') {
      if (!c.env.ASSEMBLYAI_API_KEY) {
        throw new Error('AssemblyAI API key not configured')
      }
      
      // Crear transcripción
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': c.env.ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: validatedData.audioUrl,
          language_code: 'es' // Español
        })
      })
      
      if (!transcriptResponse.ok) {
        throw new Error(`AssemblyAI error: ${transcriptResponse.status}`)
      }
      
      const transcriptData = await transcriptResponse.json() as any
      
      // Polling para obtener resultado (en producción, usar webhooks)
      let attempts = 0
      const maxAttempts = 30 // 30 segundos máximo
      
      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptData.id}`, {
          headers: {
            'Authorization': c.env.ASSEMBLYAI_API_KEY
          }
        })
        
        const statusData = await statusResponse.json() as any
        
        if (statusData.status === 'completed') {
          return c.json({
            success: true,
            text: statusData.text,
            confidence: statusData.confidence,
            provider: 'assemblyai',
            duration: statusData.audio_duration
          })
        } else if (statusData.status === 'error') {
          throw new Error(`Transcription failed: ${statusData.error}`)
        }
        
        // Esperar 1 segundo antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
      }
      
      throw new Error('Transcription timeout')
      
    } else if (provider === 'google') {
      // TODO: Implementar Google Speech-to-Text con JWT
      return c.json({
        error: 'Google STT no implementado aún',
        message: 'Usa AssemblyAI por ahora'
      }, 501)
      
    } else {
      throw new Error(`Unknown STT provider: ${provider}`)
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Datos inválidos',
        details: error.errors
      }, 400)
    }
    
    console.error('STT error:', error)
    return c.json({
      error: 'Error en transcripción',
      message: 'No se pudo transcribir el audio. Intenta de nuevo.'
    }, 500)
  }
})

export default stt
