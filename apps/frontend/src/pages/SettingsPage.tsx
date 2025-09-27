import { useState, useEffect } from 'react'
import { CheckCircle, KeyRound, Mail, RefreshCcw, Shield, Link, Loader2, XCircle, Store, Clock } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import ChangeConfirmationModal from '../components/ChangeConfirmationModal'

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
  
  // Estados para cambio de nombre de tienda
  const [storeName, setStoreName] = useState(tenant?.business_name || '')
  const [currentPasswordForName, setCurrentPasswordForName] = useState('')
  const [loadingName, setLoadingName] = useState(false)
  
  // Estados para control de cambios (5 días)
  const [changeStatus, setChangeStatus] = useState<{
    nameChangeAvailable: boolean
    slugChangeAvailable: boolean
    nameNextAvailable?: string
    slugNextAvailable?: string
    nameHoursRemaining: number
    slugHoursRemaining: number
  } | null>(null)
  
  // Estados para modales de confirmación
  const [showNameModal, setShowNameModal] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  
  // Estados para cuenta regresiva
  const [countdown, setCountdown] = useState<{ name: string; url: string }>({ name: '', url: '' })

  // Actualizar storeUrl cuando cambie el tenant
  useEffect(() => {
    if (tenant?.slug) {
      setStoreUrl(tenant.slug)
    }
  }, [tenant?.slug])

  // Actualizar storeName cuando cambie el tenant
  useEffect(() => {
    if (tenant?.business_name) {
      setStoreName(tenant.business_name)
    }
  }, [tenant?.business_name])

  // Cargar estado de cambios al montar el componente
  useEffect(() => {
    const loadChangeStatus = async () => {
      try {
        const status = await authApi.getChangeStatus()
        setChangeStatus(status)
      } catch (error) {
        console.error('Error cargando estado de cambios:', error)
      }
    }
    loadChangeStatus()
  }, [])

  // Actualizar cuenta regresiva cada minuto
  useEffect(() => {
    if (!changeStatus) return

    const updateCountdown = () => {
      const now = new Date()
      
      // Calcular tiempo restante para cambio de nombre
      if (!changeStatus.nameChangeAvailable && changeStatus.nameNextAvailable) {
        const nextAvailable = new Date(changeStatus.nameNextAvailable)
        const timeLeft = nextAvailable.getTime() - now.getTime()
        
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          
          setCountdown(prev => ({
            ...prev,
            name: days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`
          }))
        } else {
          setCountdown(prev => ({ ...prev, name: '' }))
          // Recargar estado si ya debería estar disponible
          authApi.getChangeStatus().then(setChangeStatus).catch(console.error)
        }
      } else {
        setCountdown(prev => ({ ...prev, name: '' }))
      }
      
      // Calcular tiempo restante para cambio de URL
      if (!changeStatus.slugChangeAvailable && changeStatus.slugNextAvailable) {
        const nextAvailable = new Date(changeStatus.slugNextAvailable)
        const timeLeft = nextAvailable.getTime() - now.getTime()
        
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          
          setCountdown(prev => ({
            ...prev,
            url: days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`
          }))
        } else {
          setCountdown(prev => ({ ...prev, url: '' }))
          // Recargar estado si ya debería estar disponible
          authApi.getChangeStatus().then(setChangeStatus).catch(console.error)
        }
      } else {
        setCountdown(prev => ({ ...prev, url: '' }))
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [changeStatus])

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

    // Verificar si el cambio está disponible
    if (changeStatus && !changeStatus.slugChangeAvailable) {
      showToast(`No puedes cambiar la URL hasta dentro de ${countdown.url}`, 'error')
      return
    }

    // Mostrar modal de confirmación
    setShowUrlModal(true)
  }

  const confirmUrlChange = async () => {
    try {
      setLoadingUrl(true)
      const res = await authApi.updateTenantSlug(storeUrl, currentPasswordForUrl)
      if ((res as any).success) {
        showToast('URL de tienda actualizada correctamente', 'success')
        setCurrentPasswordForUrl('')
        // Actualizar el tenant en el contexto con la nueva URL
        updateTenant({ slug: storeUrl })
        // Recargar estado de cambios
        const status = await authApi.getChangeStatus()
        setChangeStatus(status)
        setShowUrlModal(false)
      } else {
        showToast((res as any).error || 'No se pudo actualizar la URL', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'No se pudo actualizar la URL', 'error')
    } finally {
      setLoadingUrl(false)
    }
  }

  const handleUpdateStoreName = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (storeName.trim().length < 4) {
      showToast('El nombre debe tener al menos 4 caracteres', 'error')
      return
    }

    // Verificar si el cambio está disponible
    if (changeStatus && !changeStatus.nameChangeAvailable) {
      showToast(`No puedes cambiar el nombre hasta dentro de ${countdown.name}`, 'error')
      return
    }

    // Mostrar modal de confirmación
    setShowNameModal(true)
  }

  const confirmNameChange = async () => {
    try {
      setLoadingName(true)
      const res = await authApi.updateTenantName(storeName.trim(), currentPasswordForName)
      if ((res as any).success) {
        showToast('Nombre de tienda actualizado correctamente', 'success')
        setCurrentPasswordForName('')
        // Actualizar el tenant en el contexto con el nuevo nombre
        updateTenant({ business_name: storeName.trim() })
        // Recargar estado de cambios
        const status = await authApi.getChangeStatus()
        setChangeStatus(status)
        setShowNameModal(false)
      } else {
        showToast((res as any).error || 'No se pudo actualizar el nombre', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'No se pudo actualizar el nombre', 'error')
    } finally {
      setLoadingName(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300">
          <Shield className="h-4 w-4" /> Seguridad de la cuenta
        </div>
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Actualiza tu correo, contraseña, nombre y URL de tu tienda de forma segura.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
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

        <form onSubmit={handleUpdateStoreName} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Store className="h-4 w-4 text-brand-500" /> Cambiar nombre de tienda
            </div>
            {changeStatus && !changeStatus.nameChangeAvailable && countdown.name && (
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                <Clock className="h-3 w-3" />
                <span>Disponible en {countdown.name}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Nuevo nombre</label>
            <input
              type="text"
              required
              minLength={4}
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Mi Tienda Increíble"
            />
            {storeName.trim().length > 0 && storeName.trim().length < 4 && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                El nombre debe tener al menos 4 caracteres
              </p>
            )}
            {storeName.trim().length >= 4 && storeName !== tenant?.business_name && (
              <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">
                ✅ Nuevo nombre listo para guardar
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Contraseña actual</label>
            <input
              type="password"
              required
              value={currentPasswordForName}
              onChange={(e) => setCurrentPasswordForName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                loadingName || 
                storeName.trim().length < 4 || 
                storeName === tenant?.business_name || 
                !currentPasswordForName ||
                (changeStatus ? !changeStatus.nameChangeAvailable : false)
              }
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {loadingName ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Cambiar nombre
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdateStoreUrl} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Link className="h-4 w-4 text-brand-500" /> Cambiar URL de tienda
            </div>
            {changeStatus && !changeStatus.slugChangeAvailable && countdown.url && (
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                <Clock className="h-3 w-3" />
                <span>Disponible en {countdown.url}</span>
              </div>
            )}
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
              disabled={
                loadingUrl || 
                (urlStatus !== 'available' && storeUrl !== tenant?.slug) || 
                !storeUrl || 
                !currentPasswordForUrl ||
                (changeStatus ? !changeStatus.slugChangeAvailable : false)
              }
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {loadingUrl ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Cambiar URL
            </button>
          </div>
        </form>
      </section>

      {/* Modal de confirmación para cambio de nombre */}
      <ChangeConfirmationModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={confirmNameChange}
        type="name"
        currentValue={tenant?.business_name || ''}
        newValue={storeName}
        isLoading={loadingName}
      />

      {/* Modal de confirmación para cambio de URL */}
      <ChangeConfirmationModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onConfirm={confirmUrlChange}
        type="url"
        currentValue={tenant?.slug || ''}
        newValue={storeUrl}
        isLoading={loadingUrl}
      />
    </div>
  )
}


