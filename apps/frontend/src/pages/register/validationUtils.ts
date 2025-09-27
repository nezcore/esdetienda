// Utilidades de validación para el registro

import { PasswordStrength } from './types'

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length >= 5 && email.length <= 50
}

export function validateBusinessName(businessName: string): boolean {
  return businessName.trim().length >= 4
}

export function validateSlugPattern(slug: string): boolean {
  const slugPattern = /^[a-z0-9-]+$/
  return slugPattern.test(slug) && slug.length >= 4 && slug.length <= 50
}

export function saveToLocalStorage(data: {
  currentStepIndex: number
  email: string
  businessName: string
  tenantSlug: string
}) {
  localStorage.setItem('register_temp_step', data.currentStepIndex.toString())
  localStorage.setItem('register_temp_email', data.email)
  localStorage.setItem('register_temp_business', data.businessName)
  localStorage.setItem('register_temp_slug', data.tenantSlug)
}

export function clearLocalStorage() {
  localStorage.removeItem('register_temp_step')
  localStorage.removeItem('register_temp_email')
  localStorage.removeItem('register_temp_business')
  localStorage.removeItem('register_temp_slug')
}

// Generador de contraseñas seguras
export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  // Asegurar que tenga al menos uno de cada tipo
  let password = ''
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Rellenar el resto con caracteres aleatorios
  const allChars = lowercase + uppercase + numbers + symbols
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Mezclar los caracteres para evitar patrones predecibles
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Función mejorada para validar fortaleza de contraseña
export function getDetailedPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  bgColor: string
  textColor: string
  percentage: number
  suggestions: string[]
} {
  let score = 0
  const suggestions: string[] = []
  
  // Criterios de evaluación
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^A-Za-z0-9]/.test(password)
  const isLongEnough = password.length >= 8
  const isVeryLong = password.length >= 12
  const hasNoCommonPatterns = !/123|abc|qwe|pass|admin|user|1111|0000/.test(password.toLowerCase())
  
  // Calcular puntuación
  if (hasLowercase) score += 1
  else suggestions.push('Añadir letras minúsculas')
  
  if (hasUppercase) score += 1
  else suggestions.push('Añadir letras mayúsculas')
  
  if (hasNumbers) score += 1
  else suggestions.push('Añadir números')
  
  if (hasSymbols) score += 1
  else suggestions.push('Añadir símbolos (!@#$%^&*)')
  
  if (isLongEnough) score += 1
  else suggestions.push('Usar al menos 8 caracteres')
  
  if (isVeryLong) score += 1
  if (hasNoCommonPatterns) score += 1
  
  // Determinar etiqueta y colores
  let label: string
  let color: string
  let bgColor: string
  let textColor: string
  
  if (score <= 2) {
    label = 'Muy débil'
    color = 'bg-red-500'
    bgColor = 'bg-red-50 dark:bg-red-900/20'
    textColor = 'text-red-600 dark:text-red-400'
  } else if (score <= 3) {
    label = 'Débil'
    color = 'bg-orange-500'
    bgColor = 'bg-orange-50 dark:bg-orange-900/20'
    textColor = 'text-orange-600 dark:text-orange-400'
  } else if (score <= 4) {
    label = 'Regular'
    color = 'bg-yellow-500'
    bgColor = 'bg-yellow-50 dark:bg-yellow-900/20'
    textColor = 'text-yellow-600 dark:text-yellow-400'
  } else if (score <= 5) {
    label = 'Fuerte'
    color = 'bg-blue-500'
    bgColor = 'bg-blue-50 dark:bg-blue-900/20'
    textColor = 'text-blue-600 dark:text-blue-400'
  } else if (score <= 6) {
    label = 'Muy fuerte'
    color = 'bg-green-500'
    bgColor = 'bg-green-50 dark:bg-green-900/20'
    textColor = 'text-green-600 dark:text-green-400'
  } else {
    label = 'Excelente'
    color = 'bg-emerald-600'
    bgColor = 'bg-emerald-50 dark:bg-emerald-900/20'
    textColor = 'text-emerald-600 dark:text-emerald-400'
  }
  
  const percentage = Math.min((score / 7) * 100, 100)
  
  return { score, label, color, bgColor, textColor, percentage, suggestions }
}

// Función simplificada que usa la versión detallada internamente (compatibilidad)
export function validatePasswordStrength(password: string): PasswordStrength {
  return getDetailedPasswordStrength(password)
}
