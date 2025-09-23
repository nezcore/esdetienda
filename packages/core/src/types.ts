// Tipos adicionales para la aplicación

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface SearchFilters {
  query?: string
  brand?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface SearchResponse {
  products: any[]
  total: number
  suggestions?: string[]
  filters: SearchFilters
}

// Tipos para el chat/IA
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatResponse {
  response: string
  fallback?: boolean
  usage?: {
    inputTokens: number
    outputTokens: number
    estimatedCost: number
    remainingBudget: number
  }
}

// Tipos para WhatsApp
export interface WhatsAppMessage {
  from: string
  to: string
  body: string
  type: 'text' | 'image' | 'audio' | 'document'
  timestamp: string
  messageId?: string
}

export interface WhatsAppWebhookBody {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: WhatsAppMessage[]
        statuses?: any[]
      }
      field: string
    }>
  }>
}

// Tipos para análitics/métricas
export interface AnalyticsEvent {
  event: string
  tenantSlug: string
  timestamp: string
  properties: Record<string, any>
  userId?: string
  sessionId?: string
}

export interface BudgetUsage {
  model: 'nano' | 'vision' | 'stt'
  month: string
  used: number
  cap: number
  remaining: number
  percentage: number
}

// Configuración de ambiente
export interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  API_URL: string
  PUBLIC_URL: string
  
  // OpenRouter
  OPENROUTER_API_KEY: string
  OPENROUTER_API_URL: string
  OPENROUTER_SITE_URL: string
  OPENROUTER_APP_NAME: string
  
  // Budgets
  IA_NANO_BUDGET_USD: number
  IA_VISION_BUDGET_USD: number
  STT_MINUTES_CAP: number
  
  // MongoDB
  MONGODB_URI: string
  
  // Analytics
  POSTHOG_API_KEY: string
  SENTRY_DSN: string
}
