import { useState, useEffect } from 'react'
import { CheckCircle, KeyRound, Mail, RefreshCcw, Shield, Link, Loader2, XCircle } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { user, updateUserEmail, tenant, updateTenant } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  
  // Estados para cambio de URL de tienda
  const [storeUrl, setStoreUrl] = useState(tenant?.slug || '')
  const [currentPasswordForUrl, setCurrentPasswordForUrl] = useState('')
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [urlStatus, setUrlStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [urlCheckTimeout, setUrlCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  // Actualizar storeUrl cuando cambie el tenant
  useEffect(() => {
    if (tenant?.slug) {
      setStoreUrl(tenant.slug)
    }
  }, [tenant?.slug])

  // Validar URL en tiempo real
  const validateUrl = (value: string) => {
    // Patrones de validación (igual que en registro)
    const slugPattern = /^[a-z0-9-]+$/
    
    if (!value) {
      setUrlStatus('idle')
      return
    }
    
    if (!slugPattern.test(value) || value.length < 4) {
      setUrlStatus('invalid')
      return
    }

    // Si es la misma URL actual, no verificar
    if (value === tenant?.slug) {
      setUrlStatus('idle')
      return
    }

    // Limpiar timeout anterior
    if (urlCheckTimeout) {
      clearTimeout(urlCheckTimeout)
    }

    // Verificar disponibilidad con delay
    setUrlStatus('checking')
    const timeout = setTimeout(async () => {
      try {
        const response = await authApi.checkSlug(value)
        setUrlStatus(response.available ? 'available' : 'taken')
      } catch (error) {
        console.error('Error verificando URL:', error)
        setUrlStatus('available') // En caso de error, asumir disponible
      }
    }, 500)

    setUrlCheckTimeout(timeout)
  }

  // Efecto para validar URL cuando cambia
  useEffect(() => {
    validateUrl(storeUrl)
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [storeUrl])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const container = document.createElement('div')
    container.className = 'fixed inset-0 z-[9999] pointer-events-none'
    const toast = document.createElement('div')
    toast.className = `pointer-events-auto max-w-sm mx-auto mt-4 ${type === 'success' ? 'bg-emerald-600 border-emerald-400/40 shadow-emerald-500/20' : 'bg-red-600 border-red-400/40 shadow-red-500/20'} text-white px-4 py-3 rounded-xl shadow-lg border animate-[fadeIn_.2s_ease-out]`
    toast.textContent = message
    container.appendChild(toast)
    document.body.appendChild(container)
    setTimeout(() => container.remove(), 2400)
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoadingEmail(true)
      const res = await authApi.updateEmail(email, currentPasswordForEmail)
      if ((res as any).success) {
        // Actualizar el contexto de usuario con el nuevo email
        updateUserEmail(email)
        showToast('Email actualizado correctamente', 'success')
        setCurrentPasswordForEmail('')
      } else {
        showToast((res as any).error || 'No se pudo actualizar el email', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'No se pudo actualizar el email', 'error')
    } finally {
      setLoadingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoadingPassword(true)
      const res = await authApi.updatePassword(currentPassword, newPassword)
      if ((res as any).success) {
        showToast('Contraseña actualizada', 'success')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        showToast((res as any).error || 'No se pudo actualizar la contraseña', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'No se pudo actualizar la contraseña', 'error')
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleUpdateStoreUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (urlStatus !== 'available' && storeUrl !== tenant?.slug) {
      showToast('La URL debe estar disponible para cambiarla', 'error')
      return
    }

    try {
      setLoadingUrl(true)
      const res = await authApi.updateTenantSlug(storeUrl, currentPasswordForUrl)
      if ((res as any).success) {
        showToast('URL de tienda actualizada correctamente', 'success')
        setCurrentPasswordForUrl('')
        // Actualizar el tenant en el contexto con la nueva URL
        updateTenant({ slug: storeUrl })
      } else {
        showToast((res as any).error || 'No se pudo actualizar la URL', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'No se pudo actualizar la URL', 'error')
    } finally {
      setLoadingUrl(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300">
          <Shield className="h-4 w-4" /> Seguridad de la cuenta
        </div>
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Actualiza tu correo, contraseña y URL de tu tienda de forma segura.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <form onSubmit={handleUpdateEmail} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Mail className="h-4 w-4 text-brand-500" /> Cambiar correo
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Nuevo correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Contraseña actual</label>
            <input
              type="password"
              required
              value={currentPasswordForEmail}
              onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingEmail}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {loadingEmail ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Guardar correo
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <KeyRound className="h-4 w-4 text-brand-500" /> Cambiar contraseña
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Contraseña actual</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Nueva contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingPassword}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {loadingPassword ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Guardar contraseña
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdateStoreUrl} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Link className="h-4 w-4 text-brand-500" /> Cambiar URL de tienda
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Nueva URL</label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-l-xl">
                esdetienda.com/str/
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value.toLowerCase())}
                  className={`w-full px-3 py-2 pr-10 border rounded-r-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100 ${
                    urlStatus === 'invalid' || urlStatus === 'taken'
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder="mi-tienda"
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  {urlStatus === 'checking' && (
                    <Loader2 className="h-4 w-4 text-brand-500 animate-spin" />
                  )}
                  {urlStatus === 'available' && storeUrl && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  {(urlStatus === 'taken' || urlStatus === 'invalid') && storeUrl && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>
            </div>
            {urlStatus === 'invalid' && storeUrl && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                Usa al menos 4 caracteres en minúsculas, números o guiones.
              </p>
            )}
            {urlStatus === 'taken' && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                ❌ Esa URL ya está en uso por otra tienda.
              </p>
            )}
            {urlStatus === 'available' && storeUrl !== tenant?.slug && (
              <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">
                ✅ URL disponible
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Contraseña actual</label>
            <input
              type="password"
              required
              value={currentPasswordForUrl}
              onChange={(e) => setCurrentPasswordForUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingUrl || (urlStatus !== 'available' && storeUrl !== tenant?.slug) || !storeUrl || !currentPasswordForUrl}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {loadingUrl ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Cambiar URL
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}


