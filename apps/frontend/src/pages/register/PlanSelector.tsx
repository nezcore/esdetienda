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
  selectedPlan: 'esencial' | 'pro'
  onPlanChange: (plan: 'esencial' | 'pro') => void
  planDetails: Record<'esencial' | 'pro', Plan>
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ 
  selectedPlan, 
  onPlanChange, 
  planDetails 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ¡Casi listo! Elige tu plan
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Puedes cambiar o cancelar en cualquier momento
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(planDetails).map(([planKey, plan]) => {
          const key = planKey as 'esencial' | 'pro'
          const isSelected = selectedPlan === key
          const isPro = key === 'pro'

          return (
            <div
              key={key}
              onClick={() => onPlanChange(key)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md
                ${isSelected
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                    {plan.price}
                  </span>
                  {isPro && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      /mes
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
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
