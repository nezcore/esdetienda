import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const planDetails = {
    starter: {
      name: 'Plan Starter',
      price: 'RD$0/mes',
      features: [
        'Catálogo simple (hasta 50 SKUs)',
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
        'Tienda + catálogo (hasta 500 SKUs)',
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
  const selectedPlan: PlanKey = planParam && planDetails[planParam] ? planParam : 'starter'
  const currentPlan = planDetails[selectedPlan]

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      businessName: formData.get('businessName') as string,
      tenantSlug: formData.get('tenantSlug') as string,
      plan: selectedPlan
    }

    try {
      // TODO: Implementar registro real
      console.log('Register attempt:', data)
      
      // Simular registro exitoso
      setTimeout(() => {
        setLoading(false)
        navigate('/panel?welcome=true')
      }, 1500)
    } catch (error) {
      console.error('Register error:', error)
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del negocio
                    </label>
                    <input
                      name="businessName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="Ferretería El Martillo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug de tu tienda
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        esdetienda.com/str/
                      </span>
                      <input
                        name="tenantSlug"
                        type="text"
                        required
                        pattern="[a-z0-9-]+"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-r-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="ferremax"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Solo minúsculas, números y guiones</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-gray-100"
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
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Acepto los{' '}
                      <Link to="/terminos" className="text-brand-500 hover:text-brand-700">
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
                      <span>{feature}</span>
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
