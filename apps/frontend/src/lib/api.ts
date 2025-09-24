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

  // Construir usando el host y protocolo actual (para otros dispositivos en la red)
  const protocol = window.location.protocol
  const host = window.location.hostname

  // Si estamos en localhost, usar puerto 8787 directo
  if (host === 'localhost' || host === '127.0.0.1') {
    return `${protocol}//${host}:8787`
  }

  // Para acceso desde red, usar puerto 8788 (proxy)
  return `${protocol}//${host}:8788`
}

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem('api_base_url', url)
}

const API_BASE_URL = resolveDefaultApiBaseUrl()

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
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
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

  async checkSlug(slug: string): Promise<{ available: boolean }> {
    try {
      const response = await api.get(`/tenants/slug/${slug}`)
      return response // El backend ya devuelve { available: true/false }
    } catch (error) {
      // En caso de error de red, asumir que está disponible
      return { available: true }
    }
  }
}

export default api
