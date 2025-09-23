// Constantes compartidas para EsDeTienda

// Colores del branding
export const BRAND_COLORS = {
  navy: '#134572',      // Primary
  teal: '#27A3A4',      // Secondary  
  aqua: '#90BDC0',      // Light
  gray: '#617687',      // Text secondary
  lightGray: '#DEE6E1', // Borders/backgrounds
  accent: '#F79A30'     // Orange accent
} as const

// Planes disponibles
export const PLANS = {
  esencial: {
    name: 'Plan Esencial',
    priceRD: 1000,
    priceUSD: 18,
    features: [
      'Hasta 500 SKUs',
      'Bot de botones + FAQs',
      'IA texto 10,000 turnos/mes',
      'Audios→texto 100 min/mes',
      '1 usuario admin'
    ],
    limits: {
      products: 500,
      aiTextTurns: 10000,
      sttMinutes: 100,
      users: 1
    }
  },
  pro: {
    name: 'Plan Pro',
    priceRD: 2000,
    priceUSD: 36,
    features: [
      'Todo del Plan Esencial +',
      'Búsqueda mejorada (Typesense)',
      'IA texto 20,000 turnos/mes',
      'IA visión 1,000 imágenes/mes',
      'Audios→texto 300 min/mes',
      '3 usuarios admin'
    ],
    limits: {
      products: Infinity,
      aiTextTurns: 20000,
      aiVisionRequests: 1000,
      sttMinutes: 300,
      users: 3
    }
  }
} as const

// Eventos de PostHog
export const POSTHOG_EVENTS = {
  SEARCH_PERFORMED: 'search_performed',
  PRODUCT_VIEWED: 'product_viewed',
  ADD_TO_CART: 'add_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed'
} as const

// Status de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

// Precios de IA (por token)
export const AI_PRICING = {
  NANO_INPUT: 0.05 / 1_000_000,  // USD por token input
  NANO_OUTPUT: 0.40 / 1_000_000, // USD por token output
  VISION_REQUEST: 0.01,           // USD por imagen
  STT_MINUTE: 0.02               // USD por minuto
} as const

// Límites de la aplicación
export const LIMITS = {
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_PRODUCTS_PER_IMPORT: 1000,
  MAX_IMAGES_PER_PRODUCT: 5,
  MAX_SEARCH_RESULTS: 50,
  MAX_AI_TURNS_PER_CONVERSATION: 20,
  BUDGET_ALERT_THRESHOLD: 0.8 // 80%
} as const

// Configuración de paginación por defecto
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
} as const

// Extensiones de archivo permitidas
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.webp'],
  DOCUMENTS: ['.csv', '.xlsx', '.xls'],
  AUDIO: ['.mp3', '.m4a', '.ogg', '.wav']
} as const

// Configuración de cache (TTL en segundos)
export const CACHE_TTL = {
  TENANT_INFO: 3600,      // 1 hora
  PRODUCT_LIST: 1800,     // 30 minutos
  SEARCH_RESULTS: 900,    // 15 minutos
  BUDGET_STATUS: 300      // 5 minutos
} as const

// URLs de servicios externos
export const EXTERNAL_SERVICES = {
  OPENROUTER_API: 'https://openrouter.ai/api/v1',
  ASSEMBLYAI_API: 'https://api.assemblyai.com/v2',
  WHATSAPP_API: 'https://graph.facebook.com/v18.0',
  POSTHOG_API: 'https://us.i.posthog.com'
} as const
