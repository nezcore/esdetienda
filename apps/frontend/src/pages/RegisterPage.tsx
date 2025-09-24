import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Check, CheckCircle, Loader2, RefreshCcw, XCircle } from 'lucide-react'
import { authApi, type AuthResponse } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessNameTouched, setBusinessNameTouched] = useState(false)
  const [tenantSlug, setTenantSlug] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string }>({
    score: 0,
    label: 'Muy débil'
  })
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>(
    'idle'
  )
  const isBusinessNameValid = businessName.trim().length >= 4
  const slugPattern = /^[a-z0-9-]+$/
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    navigate('/panel', { replace: true })
    return null
  }

  const planDetails = {
    esencial: {
      name: 'Plan Starter',
      price: 'RD$0/mes',
      features: [
        'Catálogo simple (hasta 50 productos)',
        'Respuestas rápidas básicas',
        'IA texto 2,000 turnos/mes',
        'Audios→texto 20 min/mes',
        'Panel compartido',
        '1 usuario invitado'
      ]
    },
    grow: {
      name: 'Plan Grow',
      price: 'RD$990/mes',
      features: [
        'Tienda + catálogo (hasta 500 productos)',
        'Bot de botones + FAQs',
        'IA texto 10,000 turnos/mes',
        'Audios→texto 100 min/mes',
        'Analytics básicos',
        '1 usuario admin'
      ]
    },
    pro: {
      name: 'Plan Pro',
      price: 'RD$1,990/mes',
      features: [
        'Todo del Plan Grow +',
        'Búsqueda mejorada (Typesense)',
        'IA visión 1,000 imágenes/mes',
        'Audios→texto 300 min/mes',
        '3 usuarios admin',
        'Subdominio de marca (opcional)'
      ]
    }
  }

  type PlanKey = keyof typeof planDetails
  const planParam = searchParams.get('plan') as PlanKey | null
  const selectedPlan: PlanKey = planParam && planDetails[planParam] ? planParam : 'esencial'
  const currentPlan = planDetails[selectedPlan]

  const allowedDomainList = [
    'gmail.com',
    'googlemail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'yahoo.com',
    'icloud.com',
    'me.com',
    'mac.com'
  ]

  useEffect(() => {
    const value = tenantSlug.trim().toLowerCase()

    if (!value) {
      setSlugStatus('idle')
      return
    }

    if (!slugPattern.test(value) || value.length < 4) {
      setSlugStatus('invalid')
      return
    }

    setSlugStatus('checking')

    const delay = setTimeout(async () => {
      try {
        const response = await authApi.checkSlug(value)
        setSlugStatus(response.available ? 'available' : 'taken')
      } catch (error) {
        console.error('Error verificando slug:', error)
        // En caso de error, verificar slugs reservados localmente
        const reservedSlugs = new Set(['demo', 'starter', 'grow', 'pro', 'tienda', 'store'])
        setSlugStatus(reservedSlugs.has(value) ? 'taken' : 'available')
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [tenantSlug])

  const emailHasAt = email.includes('@')
  const emailDomainPart = (email.split('@')[1] ?? '').toLowerCase()
  const emailValid = emailHasAt && allowedDomainList.includes(emailDomainPart)

  const evaluatePassword = (value: string) => {
    let score = 0
    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/[a-z]/.test(value)) score += 1
    if (/[0-9]/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1

    const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Excelente']
    return {
      score,
      label: labels[score]
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const length = 16
    let generated = ''
    for (let i = 0; i < length; i += 1) {
      generated += chars[Math.floor(Math.random() * chars.length)]
    }
    setPassword(generated)
    setPasswordStrength(evaluatePassword(generated))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const domain = (email.split('@')[1] ?? '').toLowerCase()

    if (!isBusinessNameValid) {
      setBusinessNameTouched(true)
      return
    }

    if (tenantSlug.length < 4 || !slugPattern.test(tenantSlug)) {
      setSlugStatus('invalid')
      return
    }

    if (slugStatus !== 'available') {
      return
    }

    if (email.includes('@') && domain && !allowedDomainList.includes(domain)) {
      setEmailError('Solo admitimos correos de Gmail, Outlook (incluye Hotmail/Live/MSN), Yahoo o Apple.')
      return
    }

    setEmailError('')
    setLoading(true)

    const data = {
      email,
      password: formData.get('password') as string,
      businessName,
      tenantSlug,
      plan: selectedPlan
    }

    try {
      console.log('Intentando registrar:', data)
      
      const response: AuthResponse = await authApi.register(data)
      
      if (response.success) {
        // Usar el contexto de autenticación
        login(response.token, response.user, response.tenant)
        
        console.log('Registro exitoso:', response)
        setLoading(false)
        navigate('/panel?welcome=true')
      } else {
        throw new Error(response.message || 'Error en el registro')
      }
    } catch (error: any) {
      console.error('Error en el registro:', error)
      setEmailError(error.message || 'Error al crear la cuenta. Intenta de nuevo.')
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-brand-100/50 dark:border-gray-800/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              EsDeTienda
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.35em] mb-3">
              Configura tu tienda
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Crea tu tienda virtual
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-brand-500 hover:text-brand-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100/60 dark:border-gray-800/60">
            <div className="grid lg:grid-cols-5">
              {/* Formulario */}
              <div className="lg:col-span-3 p-8 md:p-10">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Nombre del negocio
                    </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        name="businessName"
                        type="text"
                        required
                        value={businessName}
                        onChange={(event) => setBusinessName(event.target.value)}
                        onBlur={() => setBusinessNameTouched(true)}
                        className={`w-full px-3 py-2 pr-10 border rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100 ${
                          businessNameTouched && !isBusinessNameValid
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                        placeholder="Ferretería El Martillo"
                      />
                      {businessNameTouched && businessName && (
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {isBusinessNameValid ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </span>
                      )}
                    </div>
                    {businessNameTouched && !isBusinessNameValid && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        El nombre del negocio debe tener al menos 4 caracteres.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Slug de tu tienda
                  </label>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-sm">
                        esdetienda.com/str/
                      </span>
                      <div className="relative flex-1">
                        <input
                          name="tenantSlug"
                          type="text"
                          required
                          pattern="[a-z0-9-]+"
                          value={tenantSlug}
                          onChange={(event) => setTenantSlug(event.target.value.toLowerCase())}
                          className={`w-full px-3 py-2 pr-10 border rounded-r-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100 ${
                            slugStatus === 'invalid' || slugStatus === 'taken'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 dark:border-gray-700'
                          }`}
                          placeholder="ferremax"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {slugStatus === 'checking' && (
                            <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
                          )}
                          {slugStatus === 'available' && tenantSlug && (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          )}
                          {(slugStatus === 'taken' || slugStatus === 'invalid') && tenantSlug && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </span>
                      </div>
                    </div>
                    {slugStatus === 'invalid' && tenantSlug && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        Usa al menos 4 caracteres en minúsculas, números o guiones.
                      </p>
                    )}
                    {slugStatus === 'taken' && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        Ese nombre ya está en uso. Intenta con otra variación.
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Solo minúsculas, números y guiones</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Email
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        className={`w-full px-3 py-2 pr-10 border rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100 ${
                          emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                        placeholder="tu@email.com"
                        onChange={(event) => {
                          const value = event.target.value
                          setEmail(value)
                          const hasAt = value.includes('@')
                          const domainPart = (value.split('@')[1] ?? '').toLowerCase()
                          const matchesPrefix = domainPart
                            ? allowedDomainList.some((allowed) => allowed.startsWith(domainPart))
                            : true

                          if (hasAt && domainPart && !matchesPrefix) {
                            setEmailError('Solo admitimos correos de Gmail, Outlook (incluye Hotmail/Live/MSN), Yahoo o Apple.')
                          } else {
                            setEmailError('')
                          }
                        }}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        {emailError && emailHasAt && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {!emailError && emailValid && (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        )}
                      </span>
                    </div>
                    {emailError && (
                      <div className="animate-slide-up-fade">
                        <div className="rounded-2xl border border-red-200/80 bg-red-50/90 dark:bg-red-500/10 dark:border-red-500/40 px-4 py-3 shadow-md shadow-red-500/10 backdrop-blur">
                          <p className="text-sm font-medium text-red-600 dark:text-red-300">
                            {emailError}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(event) => {
                          const value = event.target.value
                          setPassword(value)
                          setPasswordStrength(evaluatePassword(value))
                        }}
                        className="w-full px-3 py-2 pr-16 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                          Fortaleza
                        </p>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Generar contraseña
                        </button>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 1
                              ? 'bg-red-500'
                              : passwordStrength.score === 2
                              ? 'bg-yellow-500'
                              : passwordStrength.score === 3
                              ? 'bg-amber-500'
                              : passwordStrength.score === 4
                              ? 'bg-green-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(passwordStrength.score * 20, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {passwordStrength.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                      Acepto los{' '}
                      <Link to="/terminos" target="_blank" rel="noreferrer noopener" className="text-brand-500 hover:text-brand-700">
                        términos y condiciones
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-900 text-white py-3 rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando cuenta...
                      </div>
                    ) : (
                      'Crear mi cuenta'
                    )}
                  </button>
                </form>
              </div>

              {/* Plan seleccionado */}
              <div className="lg:col-span-2 bg-brand-50 dark:bg-gray-950 p-8 md:p-10 border-t lg:border-t-0 lg:border-l border-brand-100/50 dark:border-gray-800/60">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.35em] mb-3">
                  Tu selección
                </p>
                <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-1">
                  {currentPlan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-brand-900 dark:text-brand-100">{currentPlan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Renovación mensual</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300 gap-3">
                      <Check className="h-4 w-4 text-brand-500 mt-1 flex-shrink-0" />
                      <span className="font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/#pricing" 
                  className="text-brand-500 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-100 text-sm font-medium"
                >
                  Ver todos los planes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
