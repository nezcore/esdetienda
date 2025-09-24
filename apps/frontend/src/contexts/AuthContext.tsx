import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  tenantId: string
  role: string
}

interface Tenant {
  id: string
  slug: string
  business_name: string
  plan: string
  status: string
}

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User, tenant?: Tenant) => void
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Verificar autenticación al cargar la app
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')
      const storedTenant = localStorage.getItem('tenant_data')

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser)
        const tenantData = storedTenant ? JSON.parse(storedTenant) : null

        setToken(storedToken)
        setUser(userData)
        setTenant(tenantData)
      } else {
        // Limpiar datos si no hay token válido
        logout()
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = (newToken: string, userData: User, tenantData?: Tenant) => {
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('user_data', JSON.stringify(userData))
    
    if (tenantData) {
      localStorage.setItem('tenant_data', JSON.stringify(tenantData))
    }

    setToken(newToken)
    setUser(userData)
    setTenant(tenantData || null)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('tenant_data')

    setToken(null)
    setUser(null)
    setTenant(null)
  }

  const value: AuthContextType = {
    user,
    tenant,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
