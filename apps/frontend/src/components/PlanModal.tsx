import { useState, useEffect } from 'react'
import { X, Crown, Rocket, CheckCircle, Calendar, CreditCard, Sparkles } from 'lucide-react'

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
    color: 'text-emerald-600 dark:text-emerald-400',
    bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
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
    color: 'text-blue-600 dark:text-blue-400',
    bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
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
    color: 'text-orange-600 dark:text-orange-400',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: Crown,
    isPaid: true,
    features: ['Usuarios ilimitados', 'Productos ilimitados', 'Consultas AI ilimitadas', 'Audios ilimitados'],
    price: '$99/mes'
  }
}

export default function PlanModal({ isOpen, onClose, tenant }: PlanModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200)
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

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className={`bg-gradient-to-br ${currentPlan.bgGradient} border-2 ${currentPlan.borderColor} rounded-2xl shadow-2xl overflow-hidden`}>
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-2xl bg-white/60 dark:bg-black/20 ${currentPlan.borderColor} border`}>
                <Icon className={`h-8 w-8 ${currentPlan.color}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${currentPlan.color}`}>
                  Plan {currentPlan.displayName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentPlan.price}
                </p>
              </div>
            </div>

            {currentPlan.isPaid ? (
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300 bg-green-100/60 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">¡Felicidades! Eres usuario premium</span>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300 bg-white/40 dark:bg-black/20 px-3 py-2 rounded-lg">
                <span className="text-sm">Estás usando nuestro plan gratuito</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Plan Details */}
            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activado</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(activationDate)}
                </span>
              </div>

              {currentPlan.isPaid && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Renovación</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(renewalDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm">
                Características incluidas
              </h3>
              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Button */}
            {currentPlan.nextPlan && (
              <button
                onClick={handleUpgrade}
                className={`w-full bg-gradient-to-r ${
                  currentPlan.name === 'esencial' 
                    ? 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                    : 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                } text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2`}
              >
                <Rocket className="h-5 w-5" />
                <span>Actualizar a {currentPlan.nextPlanDisplayName}</span>
              </button>
            )}
            
            {!currentPlan.nextPlan && currentPlan.isPaid && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  🎉 ¡Tienes el plan más avanzado!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
