// Configuración de la API
const resolveDefaultApiBaseUrl = () => {
  const fallbackPort = import.meta.env.VITE_API_PORT || '8787'

  if (typeof window === 'undefined') {
    // SSR / build
    return import.meta.env.VITE_API_URL || `http://127.0.0.1:${fallbackPort}`
  }

  // Intentar tomar desde localStorage primero (permite sobrescribir desde el dispositivo)
  const storedUrl = localStorage.getItem('api_base_url')
  if (storedUrl) {
    return storedUrl
  }

  // Intentar desde variable de entorno de Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Fallback a API desplegada en producción
  return 'https://api.esdetienda.com'
}

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem('api_base_url', url)
}

export const clearApiBaseUrl = () => {
  localStorage.removeItem('api_base_url')
}

export const API_BASE_URL = resolveDefaultApiBaseUrl()

// Exponer para depuración en navegador (p.ej., móvil)
if (typeof window !== 'undefined') {
  ;(window as any).API_BASE_URL = API_BASE_URL
}

// Cliente HTTP básico
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        // Priorizar el mensaje específico sobre el error genérico
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
        
        // Solo agregar detalles técnicos si no hay un mensaje amigable
        if (errorData.details && !errorData.message) {
          console.error('Validation details:', errorData.details)
          errorMessage += ` - Details: ${JSON.stringify(errorData.details)}`
        } else if (errorData.details) {
          // Solo loggear los detalles técnicos en la consola para debugging
          console.error('Validation details:', errorData.details)
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error)
      throw error
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Instancia del cliente API
export const api = new ApiClient(API_BASE_URL)

// Tipos de respuesta
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  details?: any
}

export interface User {
  id: string
  email: string
  tenantId: string
  role: string
}

export interface Tenant {
  id: string
  slug: string
  business_name: string
  plan: string
  status: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
  tenant?: Tenant
  message?: string
}

// Funciones específicas de la API
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', { email, password })
  },

  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; admin: { id: string; email: string; role: 'superadmin' }; message?: string }> {
    return api.post('/admin/login', { email, password })
  },

  async register(data: {
    email: string
    password: string
    businessName: string
    tenantSlug: string
    plan: string
  }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', data)
  },

  async logout(): Promise<void> {
    // TODO: Implementar logout en el backend
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  },

  async updateEmail(newEmail: string, currentPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return api.put('/auth/email', { newEmail, currentPassword })
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return api.put('/auth/password', { currentPassword, newPassword })
  },

  async updateTenantSlug(newSlug: string, currentPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return api.put('/tenants/slug', { newSlug, currentPassword })
  },

  async updateTenantName(newName: string, currentPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return api.put('/tenants/name', { newName, currentPassword })
  },

  async getChangeStatus(): Promise<{
    nameChangeAvailable: boolean
    slugChangeAvailable: boolean
    nameNextAvailable?: string
    slugNextAvailable?: string
    nameHoursRemaining: number
    slugHoursRemaining: number
  }> {
    return api.get('/tenants/change-status')
  },

  async checkSlug(slug: string): Promise<{ available: boolean }> {
    try {
      const response = await api.get<{ available: boolean }>(`/tenants/slug/${slug}`)
      return response
    } catch (error) {
      // En caso de error de red, asumir que está disponible
      return { available: true }
    }
  },

  async checkEmail(email: string): Promise<{ available: boolean; message?: string }> {
    try {
      const response = await api.get<{ available: boolean; message?: string }>(`/auth/check-email/${encodeURIComponent(email)}`)
      return response
    } catch (error) {
      // En caso de error de red, asumir que está disponible
      return { available: true }
    }
  }
}

export default api
