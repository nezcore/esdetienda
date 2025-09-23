import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const selectedPlan = searchParams.get('plan') || 'esencial'

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

  const planDetails = {
    esencial: {
      name: 'Plan Esencial',
      price: 'RD$1,000/mes',
      features: ['Hasta 500 SKUs', 'Bot de botones', 'IA texto 10k turnos/mes', '1 usuario']
    },
    pro: {
      name: 'Plan Pro', 
      price: 'RD$2,000/mes',
      features: ['Todo Esencial +', 'Búsqueda mejorada', 'IA visión 1k imgs/mes', '3 usuarios']
    }
  }

  const currentPlan = planDetails[selectedPlan as keyof typeof planDetails] || planDetails.esencial

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              EsDeTienda
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crea tu tienda virtual
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Formulario */}
            <div className="p-8">
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del negocio
                  </label>
                  <input
                    name="businessName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Ferretería El Martillo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug de tu tienda
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      esdetienda.com/
                    </span>
                    <input
                      name="tenantSlug"
                      type="text"
                      required
                      pattern="[a-z0-9-]+"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-xl focus:ring-brand-500 focus:border-brand-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
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
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
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
                  <label className="ml-2 text-sm text-gray-600">
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
            <div className="bg-brand-50 p-8">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                {currentPlan.name}
              </h3>
              <div className="text-2xl font-bold text-brand-900 mb-4">
                {currentPlan.price}
              </div>
              <ul className="space-y-2 mb-6">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-brand-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/#pricing" 
                className="text-brand-500 hover:text-brand-700 text-sm font-medium"
              >
                Ver todos los planes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
