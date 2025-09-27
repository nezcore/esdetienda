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

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
        {Object.entries(planDetails).map(([planKey, plan]) => {
          const key = planKey as 'esencial' | 'basico' | 'pro'
          const isSelected = selectedPlan === key
          const isPro = key === 'pro'

          return (
            <div
              key={key}
              onClick={() => onPlanChange(key)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-6 md:p-8 lg:p-10 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 min-h-[400px] md:min-h-[450px]
                ${isSelected
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-lg ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-25 dark:hover:bg-brand-950/10'
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
                  <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
                    <Check className="h-4 w-4 text-white font-bold" strokeWidth={3} />
                  </div>
                </div>
              )}
              
              {/* Indicador de selección adicional */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-brand-500/5 pointer-events-none"></div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Mensaje de confirmación de selección */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="text-center">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            ✅ Plan seleccionado: <span className="font-bold">{planDetails[selectedPlan].name}</span>
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Precio: {planDetails[selectedPlan].price} {selectedPlan === 'pro' && ''}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlanSelector
