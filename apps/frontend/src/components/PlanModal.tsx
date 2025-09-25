import { useState, useEffect } from 'react'
import { X, Crown, Rocket, CheckCircle, Calendar, CreditCard, Sparkles, AlertTriangle } from 'lucide-react'

interface Tenant {
  id: string
  slug: string
  business_name: string
  plan: string
  status: string
  created_at?: string
}

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  tenant: Tenant | null
}

interface PlanInfo {
  name: string
  displayName: string
  color: string
  bgGradient: string
  borderColor: string
  icon: React.ComponentType<{ className?: string }>
  isPaid: boolean
  nextPlan?: string
  nextPlanDisplayName?: string
  features: string[]
  price: string
}

const planConfig: Record<string, PlanInfo> = {
  esencial: {
    name: 'esencial',
    displayName: 'Starter',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgGradient: 'from-emerald-100 to-green-100 dark:from-emerald-900/80 dark:to-green-900/80',
    borderColor: 'border-emerald-300 dark:border-emerald-600',
    icon: Sparkles,
    isPaid: false,
    nextPlan: 'grow',
    nextPlanDisplayName: 'Grow',
    features: ['1 usuario', '50 productos', '100 consultas AI/mes', '10 audios/mes'],
    price: 'Gratis'
  },
  grow: {
    name: 'grow',
    displayName: 'Grow',
    color: 'text-blue-700 dark:text-blue-300',
    bgGradient: 'from-blue-100 to-indigo-100 dark:from-blue-900/80 dark:to-indigo-900/80',
    borderColor: 'border-blue-300 dark:border-blue-600',
    icon: Rocket,
    isPaid: true,
    nextPlan: 'pro',
    nextPlanDisplayName: 'Pro',
    features: ['5 usuarios', '500 productos', '1,000 consultas AI/mes', '100 audios/mes'],
    price: '$29/mes'
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    color: 'text-orange-700 dark:text-orange-300',
    bgGradient: 'from-orange-100 to-red-100 dark:from-orange-900/80 dark:to-red-900/80',
    borderColor: 'border-orange-300 dark:border-orange-600',
    icon: Crown,
    isPaid: true,
    features: ['Usuarios ilimitados', 'Productos ilimitados', 'Consultas AI ilimitadas', 'Audios ilimitados'],
    price: '$99/mes'
  }
}

export default function PlanModal({ isOpen, onClose, tenant }: PlanModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Mostrar contenido con un ligero retraso para mejor animación
      setTimeout(() => setShowContent(true), 50)
    } else {
      setShowContent(false)
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  const currentPlan = tenant?.plan ? planConfig[tenant.plan] : null
  if (!currentPlan) return null

  const Icon = currentPlan.icon
  
  // Simular fechas (en producción esto vendría de la base de datos)
  const activationDate = tenant?.created_at 
    ? new Date(tenant.created_at)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Hace 30 días
    
  const renewalDate = new Date(activationDate)
  renewalDate.setMonth(renewalDate.getMonth() + 1)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleUpgrade = () => {
    // TODO: Implementar lógica de actualización de plan
    console.log('Upgrade to:', currentPlan.nextPlan)
    onClose()
  }

  const handleCancelPlan = () => {
    // TODO: Implementar lógica de cancelación de plan/cuenta
    console.log('Cancel plan for tenant:', tenant?.id)
    if (window.confirm('¿Estás seguro de que deseas cancelar tu plan? Esta acción eliminará tu cuenta y todos tus datos.')) {
      // Aquí iría la lógica de cancelación
      console.log('Plan cancelled')
      onClose()
    }
  }

  const handleDowngrade = () => {
    const targetPlan = currentPlan.name === 'pro' ? 'grow' : 'esencial'
    const targetPlanName = targetPlan === 'grow' ? planConfig.grow.displayName : planConfig.esencial.displayName
    if (window.confirm(`¿Deseas hacer downgrade al plan ${targetPlanName}?`)) {
      console.log('Downgrade to:', targetPlan)
      // TODO: Implementar llamada al backend para cambiar de plan
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`w-full max-w-sm sm:max-w-md transition-all duration-300 ease-out ${
            showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className={`bg-gradient-to-br ${currentPlan.bgGradient} border-2 ${currentPlan.borderColor} rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md max-h-[85vh] overflow-y-auto`}>
            {/* Header */}
            <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-2xl bg-white/80 dark:bg-gray-800/90 ${currentPlan.borderColor} border shadow-lg`}>
                <Icon className={`h-8 w-8 ${currentPlan.color}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${currentPlan.color}`}>
                  Plan {currentPlan.displayName}
                </h2>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {currentPlan.price}
                </p>
              </div>
            </div>

            {currentPlan.isPaid ? (
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 bg-green-200/80 dark:bg-green-800/90 px-3 py-2 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold text-sm">¡Felicidades! Eres usuario premium</span>
              </div>
            ) : (
              <div className="text-gray-800 dark:text-gray-100 bg-white/70 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm">
                <span className="text-sm font-semibold">Estás usando nuestro plan gratuito</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Upgrade Button (Top) */}
            {currentPlan.nextPlan && (
              <button
                onClick={handleUpgrade}
                className={`w-full bg-gradient-to-r ${
                  currentPlan.name === 'esencial' 
                    ? 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                    : 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                } text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 shadow-md`}
              >
                <Rocket className="h-5 w-5" />
                <span>Actualizar a {currentPlan.nextPlanDisplayName}</span>
              </button>
            )}
            {/* Plan Details */}
            <div className="bg-white/80 dark:bg-gray-800/90 rounded-xl p-4 space-y-3 shadow-sm border border-white/30 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Activado</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {formatDate(activationDate)}
                </span>
              </div>

              {currentPlan.isPaid && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Renovación</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {formatDate(renewalDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white/80 dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-white/30 dark:border-gray-700/50">
              <h3 className="font-bold text-gray-900 dark:text-gray-50 mb-3 text-sm">
                Características incluidas
              </h3>
              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentPlan.isPaid && (
                <button
                  onClick={handleDowngrade}
                  className="w-full bg-red-100/90 dark:bg-red-900/60 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-100 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 hover:bg-red-200/90 dark:hover:bg-red-800/70"
                >
                  Hacer downgrade a {currentPlan.name === 'pro' ? planConfig.grow.displayName : planConfig.esencial.displayName}
                </button>
              )}

              {/* Cancel Plan Button */}
              <button
                onClick={handleCancelPlan}
                className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm text-sm"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Cancelar Plan / Cerrar Cuenta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
