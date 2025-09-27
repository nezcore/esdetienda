import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ChangeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'name' | 'url'
  currentValue: string
  newValue: string
  isLoading: boolean
}

const ChangeConfirmationModal: React.FC<ChangeConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  currentValue,
  newValue,
  isLoading
}) => {
  if (!isOpen) return null

  const typeText = type === 'name' ? 'nombre' : 'URL'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar cambio de {typeText}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium mb-2">
              ⚠️ Importante
            </p>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Solo puedes cambiar el {typeText} <strong>una vez cada 5 días</strong>. 
              Después de este cambio, deberás esperar 5 días completos para poder cambiarlo nuevamente.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{typeText.charAt(0).toUpperCase() + typeText.slice(1)} actual:</span>
              <span className="font-medium text-gray-900 dark:text-white">{currentValue}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{typeText.charAt(0).toUpperCase() + typeText.slice(1)} nuevo:</span>
              <span className="font-medium text-brand-600 dark:text-brand-400">{newValue}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Cambiando...' : 'Sí, cambiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeConfirmationModal
