// Tercer paso del registro: términos, condiciones y resumen

import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'

interface TermsStepProps {
  businessName: string
  tenantSlug: string
  email: string
  selectedPlan: 'esencial' | 'basico' | 'pro'
  acceptTerms: boolean
  setAcceptTerms: (value: boolean) => void
  termsTouched: boolean
  setTermsTouched: (value: boolean) => void
}

const TermsStep: React.FC<TermsStepProps> = ({
  businessName,
  tenantSlug,
  email,
  selectedPlan,
  acceptTerms,
  setAcceptTerms,
  termsTouched,
  setTermsTouched
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-brand-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            ¡Todo listo para empezar!
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Revisa los detalles y acepta los términos para crear tu tienda
        </p>
      </div>

      {/* Resumen de la información */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Resumen de tu tienda</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Nombre del negocio:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {businessName || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">URL de la tienda:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {tenantSlug ? `esdetienda.com/str/${tenantSlug}` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {email || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Plan seleccionado:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {selectedPlan}
            </span>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="accept-terms"
              name="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked)
                setTermsTouched(true)
              }}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="accept-terms" className="text-gray-700 dark:text-gray-300">
              Acepto los{' '}
              <Link 
                to="/terminos" 
                className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Términos y Condiciones
              </Link>{' '}
              y la Política de Privacidad de EsDeTienda
            </label>
          </div>
        </div>
        
        {termsTouched && !acceptTerms && (
          <p className="text-sm text-red-500 dark:text-red-400 ml-7">
            Debes aceptar los términos y condiciones para continuar
          </p>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-sm">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              ¿Qué sucede después?
            </h4>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200">
              <li>• Tu tienda será creada instantáneamente</li>
              <li>• Recibirás un email de confirmación</li>
              <li>• Podrás acceder a tu panel de administración</li>
              <li>• Comenzarás a agregar tus productos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsStep
