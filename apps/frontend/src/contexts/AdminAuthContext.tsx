import React, { createContext, useContext, useEffect, useState } from 'react'

interface AdminUser {
  id: string
  email: string
  role: 'superadmin'
}

interface AdminAuthContextType {
  token: string | null
  admin: AdminUser | null
  isAuthenticated: boolean
  login: (token: string, admin: AdminUser) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    const a = localStorage.getItem('admin_user')
    if (t && a) {
      setToken(t)
      try { setAdmin(JSON.parse(a)) } catch {}
    }
  }, [])

  const login = (t: string, a: AdminUser) => {
    setToken(t)
    setAdmin(a)
    localStorage.setItem('admin_token', t)
    localStorage.setItem('admin_user', JSON.stringify(a))
  }

  const logout = () => {
    setToken(null)
    setAdmin(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  return (
    <AdminAuthContext.Provider value={{ token, admin, isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}


