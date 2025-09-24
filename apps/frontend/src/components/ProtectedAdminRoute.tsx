import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/acceso" state={{ from: location }} replace />
  }

  return <>{children}</>
}


