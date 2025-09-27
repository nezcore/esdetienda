// Lógica de generación y validación de slugs para tiendas

import { authApi } from '../../lib/api'

export function generateSlugFromBusiness(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios → guiones
    .replace(/-+/g, '-') // Múltiples guiones → uno solo
    .substring(0, 50) // Máximo 50 caracteres
}

export async function generateAvailableSlug(businessName: string): Promise<string | null> {
  if (businessName.length < 4) return null

  const baseSlug = generateSlugFromBusiness(businessName)
  if (baseSlug.length < 4) return null

  console.log(`🔍 Buscando slug disponible basado en: "${businessName}" → "${baseSlug}"`)

  // Lista de variaciones para probar
  const variations = [
    baseSlug,                    // ferreteria
    `${baseSlug}1`,             // ferreteria1  
    `${baseSlug}2`,             // ferreteria2
    `${baseSlug}3`,             // ferreteria3
    `${baseSlug}-store`,        // ferreteria-store
    `${baseSlug}-shop`,         // ferreteria-shop  
    `${baseSlug}-tienda`,       // ferreteria-tienda
    `mi-${baseSlug}`,           // mi-ferreteria
    `la-${baseSlug}`,           // la-ferreteria
    `${baseSlug}-rd`,           // ferreteria-rd
  ]

  // Probar cada variación hasta encontrar una disponible
  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i]
    
    try {
      console.log(`🔎 Verificando (${i+1}/${variations.length}): "${variation}"`)
      const response = await authApi.checkSlug(variation)
      
      if (response.available) {
        console.log(`✅ DISPONIBLE: "${variation}"`)
        return variation
      } else {
        console.log(`❌ OCUPADO: "${variation}"`)
      }
      
      // Pequeño delay para no sobrecargar el servidor
      if (i < variations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`Error verificando slug "${variation}":`, error)
      // En caso de error de red, continuar con la siguiente variación
      continue
    }
  }

  // Si no encontramos ninguna variación disponible, generar con timestamp
  const timestampSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`
  console.log(`🎲 Generando con timestamp: "${timestampSlug}"`)
  return timestampSlug
}

export async function generateSlugSuggestions(businessName: string, slugPattern: RegExp): Promise<string[]> {
  // Usar el nombre del negocio como base, no la URL actual
  const baseForSuggestions = businessName
  
  if (!baseForSuggestions || baseForSuggestions.length < 3) {
    console.log('🚫 Nombre del negocio muy corto:', baseForSuggestions)
    return []
  }

  // Generar slug base desde el nombre del negocio
  const cleanSlug = generateSlugFromBusiness(baseForSuggestions)
  
  console.log(`🔍 Generando sugerencias basadas en: "${baseForSuggestions}" → "${cleanSlug}"`)
  const suggestions: string[] = []
  
  // Crear variaciones desde el nombre original, no la URL actual
  const variations = [
    // Primero el slug base generado
    cleanSlug,
    // Variaciones simples
    `${cleanSlug}1`,
    `${cleanSlug}2`,
    `${cleanSlug}3`,
    // Con descriptores de tienda
    `${cleanSlug}-tienda`,
    `${cleanSlug}-store`,
    `${cleanSlug}-shop`,
    `tienda-${cleanSlug}`,
    // Prefijos comunes
    `mi-${cleanSlug}`,
    `el-${cleanSlug}`,
    `super-${cleanSlug}`,
    // Sufijos geográficos
    `${cleanSlug}-rd`,
    `${cleanSlug}-do`,
    `${cleanSlug}-online`,
    `${cleanSlug}-plus`,
    `${cleanSlug}-pro`
  ].filter(v => v.length >= 4 && slugPattern.test(v)) // Filtrar antes de verificar

  console.log(`📋 ${variations.length} variaciones basadas en "${baseForSuggestions}":`, variations)

  // Verificar en lotes pequeños para mejor rendimiento
  for (let i = 0; i < variations.length && suggestions.length < 5; i++) {
    const variation = variations[i]
    
    try {
      const response = await authApi.checkSlug(variation)
      if (response.available) {
        suggestions.push(variation)
        console.log(`✅ Sugerencia disponible: "${variation}"`)
      } else {
        console.log(`❌ Sugerencia ocupada: "${variation}"`)
      }
      
      // Delay corto para no saturar el servidor
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (error) {
      console.error(`Error verificando sugerencia "${variation}":`, error)
    }
  }

  console.log(`📝 ${suggestions.length} sugerencias finales encontradas:`, suggestions)
  return suggestions
}
