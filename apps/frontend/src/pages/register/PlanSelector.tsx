// Componente para la selección de planes de suscripción

import React from 'react'
import { Check } from 'lucide-react'

interface Plan {
  name: string
  price: string
  description: string
  features: string[]
  badge?: string
  popular?: boolean
}

interface PlanSelectorProps {
  selectedPlan: 'esencial' | 'basico' | 'pro'
  onPlanChange: (plan: 'esencial' | 'basico' | 'pro') => void
  planDetails: Record<'esencial' | 'basico' | 'pro', Plan>
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ 
  selectedPlan, 
  onPlanChange, 
  planDetails 
}) => {
  const getCardStyles = (planKey: 'esencial' | 'basico' | 'pro', isSelected: boolean) => {
    const styles = {
      esencial: {
        selected: 'border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/30 shadow-lg ring-2 ring-emerald-400/30',
        unselected: 'border-emerald-200/60 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 bg-emerald-25/30 dark:bg-emerald-900/10'
      },
      basico: {
        selected: 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/30 shadow-lg ring-2 ring-blue-400/30',
        unselected: 'border-blue-200/60 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 bg-blue-25/30 dark:bg-blue-900/10'
      },
      pro: {
        selected: 'border-orange-400 bg-orange-50/80 dark:bg-orange-900/30 shadow-lg ring-2 ring-orange-400/30',
        unselected: 'border-orange-200/60 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 bg-orange-25/30 dark:bg-orange-900/10'
      }
    }
    return isSelected ? styles[planKey].selected : styles[planKey].unselected
  }

  const getCheckmarkColor = (planKey: 'esencial' | 'basico' | 'pro') => {
    const colors = {
      esencial: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      basico: 'bg-gradient-to-br from-blue-500 to-blue-600',
      pro: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
    return colors[planKey]
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-2">
          ¡Casi listo! Elige tu plan
        </h2>
        <p className="text-base sm:text-sm text-gray-600 dark:text-gray-400">
          Puedes cambiar o cancelar en cualquier momento
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
        {/* En tablet (md): 2 tarjetas arriba, 1 abajo. En desktop (lg+): 3 en una fila */}
        {Object.entries(planDetails).map(([planKey, plan], index) => {
          const key = planKey as 'esencial' | 'basico' | 'pro'
          const isSelected = selectedPlan === key
          const isPro = key === 'pro'
          const isLastCard = index === Object.entries(planDetails).length - 1

          return (
            <div
              key={key}
              onClick={() => onPlanChange(key)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 min-h-[400px] md:min-h-[450px] lg:min-h-[480px]
                ${getCardStyles(key, isSelected)}
                ${isLastCard ? 'md:col-span-2 md:mx-auto md:max-w-md lg:col-span-1 lg:max-w-none lg:mx-0' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    ⭐ Más Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {plan.name}
                </h3>
                <div className="mt-3 sm:mt-2">
                  <span className="text-4xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">
                    {plan.price}
                  </span>
                </div>
                <p className="text-base sm:text-sm text-gray-600 dark:text-gray-400 mt-3 sm:mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base sm:text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900 ${getCheckmarkColor(key)}`}>
                    <Check className="h-4 w-4 text-white font-bold" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlanSelector
