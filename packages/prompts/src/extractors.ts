import { z } from 'zod'

// Schema para extracción de productos de imágenes
export const ProductExtractionSchema = z.object({
  brand: z.string().nullable(),
  product_type: z.string(),
  model_guess: z.string().nullable(),
  color: z.string().nullable(),
  size_guess: z.string().nullable(),
  query: z.string(),
  confidence: z.number().min(0).max(1)
})

export type ProductExtraction = z.infer<typeof ProductExtractionSchema>

// Schema para comparación de productos
export const ProductMatchSchema = z.object({
  product_id: z.string(),
  similarity_score: z.number().min(0).max(1),
  matching_features: z.array(z.string()),
  differences: z.array(z.string())
})

export const ProductComparisonSchema = z.object({
  matches: z.array(ProductMatchSchema),
  best_match_id: z.string().nullable(),
  recommendation: z.string()
})

export type ProductMatch = z.infer<typeof ProductMatchSchema>
export type ProductComparison = z.infer<typeof ProductComparisonSchema>

// Funciones helper para extraer y validar respuestas de IA

export function extractProductInfo(jsonResponse: string): ProductExtraction | null {
  try {
    const parsed = JSON.parse(jsonResponse)
    return ProductExtractionSchema.parse(parsed)
  } catch (error) {
    console.error('Failed to extract product info:', error)
    return null
  }
}

export function extractProductComparison(jsonResponse: string): ProductComparison | null {
  try {
    const parsed = JSON.parse(jsonResponse)
    return ProductComparisonSchema.parse(parsed)
  } catch (error) {
    console.error('Failed to extract product comparison:', error)
    return null
  }
}

// Sinónimos comunes para mejorar búsqueda (ES-RD)
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  'tenis': ['zapatillas', 'sneakers'],
  'zapatillas': ['tenis', 'sneakers'],
  'celular': ['móvil', 'teléfono', 'smartphone'],
  'móvil': ['celular', 'teléfono', 'smartphone'],
  'laptop': ['portátil', 'computadora'],
  'portátil': ['laptop', 'computadora'],
  'nevera': ['frigorífico', 'refrigerador'],
  'frigorífico': ['nevera', 'refrigerador'],
  'tv': ['televisor', 'televisión'],
  'televisor': ['tv', 'televisión'],
  'audífonos': ['auriculares', 'headphones'],
  'auriculares': ['audífonos', 'headphones'],
  'jeans': ['vaqueros', 'pantalones'],
  'vaqueros': ['jeans', 'pantalones'],
  'sandalias': ['chancletas'],
  'chancletas': ['sandalias'],
  'gomas': ['neumáticos', 'llantas'],
  'neumáticos': ['gomas', 'llantas'],
  'memoria': ['ram', 'almacenamiento'],
  'ram': ['memoria']
}

// Expandir query con sinónimos
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(' ')
  const expandedQueries: Set<string> = new Set([query])
  
  words.forEach(word => {
    if (SEARCH_SYNONYMS[word]) {
      SEARCH_SYNONYMS[word].forEach(synonym => {
        const expandedQuery = query.toLowerCase().replace(word, synonym)
        expandedQueries.add(expandedQuery)
      })
    }
  })
  
  return Array.from(expandedQueries)
}

// Validar confianza mínima para mostrar resultados
export function isHighConfidence(extraction: ProductExtraction, threshold: number = 0.6): boolean {
  return extraction.confidence >= threshold
}

// Generar texto de búsqueda mejorado
export function generateSearchQuery(extraction: ProductExtraction): string {
  const parts: string[] = []
  
  if (extraction.brand && extraction.confidence > 0.7) {
    parts.push(extraction.brand)
  }
  
  parts.push(extraction.product_type)
  
  if (extraction.model_guess && extraction.confidence > 0.8) {
    parts.push(extraction.model_guess)
  }
  
  if (extraction.color && extraction.confidence > 0.5) {
    parts.push(extraction.color)
  }
  
  return parts.join(' ').toLowerCase()
}
