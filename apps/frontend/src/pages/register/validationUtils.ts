// Utilidades de validación para el registro

import { PasswordStrength } from './types'

export function validatePasswordStrength(password: string): PasswordStrength {
  let score = 0
  let label = 'Muy débil'

  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  switch (score) {
    case 0:
    case 1:
      label = 'Muy débil'
      break
    case 2:
      label = 'Débil'
      break
    case 3:
      label = 'Regular'
      break
    case 4:
      label = 'Fuerte'
      break
    case 5:
      label = 'Muy fuerte'
      break
  }

  return { score, label }
}

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
