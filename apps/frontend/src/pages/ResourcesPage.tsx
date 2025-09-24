import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { authApi } from '../lib/api'

const planResources = {
  esencial: {
    label: 'Starter',
    color: 'emerald',
    description: 'Recursos incluidos en tu plan Starter',
    items: [
      { label: 'Productos activos', used: 12, limit: 50 },
      { label: 'Consultas de IA texto', used: 320, limit: 2000 },
      { label: 'Audios a texto (minutos)', used: 8, limit: 20 },
      { label: 'Usuarios', used: 1, limit: 1 }
    ]
  },
  grow: {
    label: 'Grow',
    color: 'sky',
    description: 'Recursos incluidos en tu plan Grow',
    items: [
      { label: 'Productos activos', used: 220, limit: 500 },
      { label: 'Consultas de IA texto', used: 3120, limit: 10000 },
      { label: 'Audios a texto (minutos)', used: 45, limit: 100 },
      { label: 'Usuarios admin', used: 1, limit: 1 }
    ]
  },
  pro: {
    label: 'Pro',
    color: 'orange',
    description: 'Recursos incluidos en tu plan Pro',
    items: [
      { label: 'Productos activos', used: 620, limit: 5000 },
      { label: 'Consultas de IA texto', used: 11200, limit: 20000 },
      { label: 'Consultas IA visión (imágenes)', used: 420, limit: 1000 },
      { label: 'Audios a texto (minutos)', used: 180, limit: 300 },
      { label: 'Usuarios admin', used: 2, limit: 3 }
    ]
  }
}

type PlanKey = keyof typeof planResources

const colorMap: Record<string, { bar: string; bg: string; text: string; glow: string }> = {
  emerald: {
    bar: 'from-emerald-400 to-emerald-500',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-200',
    glow: 'shadow-emerald-500/40'
  },
  sky: {
    bar: 'from-sky-400 to-sky-500',
    bg: 'bg-sky-500/15 dark:bg-sky-500/20',
    text: 'text-sky-600 dark:text-sky-200',
    glow: 'shadow-sky-500/40'
  },
  orange: {
    bar: 'from-orange-400 to-orange-500',
    bg: 'bg-orange-500/15 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-200',
    glow: 'shadow-orange-500/40'
  }
}

function ResourceProgress({ used, limit, color }: { used: number; limit: number; color: keyof typeof colorMap }) {
  const percent = Math.min(Math.round((used / limit) * 100), 100)
  const isNearLimit = percent >= 90

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-gray-600 dark:text-gray-300">{used} de {limit}</span>
        <span className={isNearLimit ? 'text-orange-500 dark:text-orange-300' : 'text-gray-500 dark:text-gray-400'}>{percent}%</span>
      </div>
      <div className="h-3 w-full bg-gray-200/70 dark:bg-gray-800/70 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color].bar} transition-all duration-500 ${
            isNearLimit ? 'shadow-md shadow-orange-400/30' : ''
          }`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}

type UsageItem = { key: string; label: string; used: number; limit: number; renewableMonthly: boolean }

export default function ResourcesPage() {
  const { tenant } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<UsageItem[] | null>(null)
  const [resetAt, setResetAt] = useState<string | null>(null)

  const planKey = (tenant?.plan as PlanKey) ?? 'esencial'
  const planData = useMemo(() => planResources[planKey] ?? planResources.esencial, [planKey])
  const colorTokens = colorMap[planData.color] ?? colorMap.emerald

  useEffect(() => {
    const fetchUsage = async () => {
      if (!tenant?.id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${(window as any).API_BASE_URL ?? ''}/usage/tenant/${tenant.id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setItems(data.items)
        setResetAt(data.resetAt)
      } catch (err: any) {
        setError(err.message || 'Error cargando uso')
      } finally {
        setLoading(false)
      }
    }
    fetchUsage()
  }, [tenant?.id])

  return (
    <section className="space-y-8">
      <div
        className={`rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm shadow-black/5 ${colorTokens.glow}`}
      >
        <div className={`h-2 bg-gradient-to-r ${colorTokens.bar}`}></div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorTokens.bg} ${colorTokens.text}`}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  {planData.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Plan actual</span>
              </div>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Recursos disponibles
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
                {planData.description}. Aquí puedes monitorear tu consumo actual y cuánto te queda disponible.
              </p>
            </div>
            <div className={`rounded-2xl px-6 py-5 bg-white/70 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700/60`}> 
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Próximo reinicio</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {resetAt ? new Date(resetAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                {loading && (
                  <div className="ml-auto inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Actualizando
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(items ?? planData.items).map((item) => {
          const percent = Math.min(Math.round((item.used / item.limit) * 100), 100)
          const isNearLimit = percent >= 90
          const isOver = percent >= 100

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm shadow-black/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.label}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Consulta el uso actual y disponibilidad restante de este recurso.
                  </p>
                </div>
                {isOver ? (
                  <span className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-300 bg-red-500/10 dark:bg-red-500/15 rounded-full px-3 py-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Límite alcanzado
                  </span>
                ) : isNearLimit ? (
                  <span className="inline-flex items-center text-xs font-semibold text-orange-600 dark:text-orange-300 bg-orange-500/10 dark:bg-orange-500/15 rounded-full px-3 py-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Cerca del límite
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Disponible
                  </span>
                )}
              </div>

              <div className="mt-6">
                <ResourceProgress used={item.used} limit={item.limit} color={planData.color} />
                {item.renewableMonthly && (
                  <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                    Se reinicia mensualmente {resetAt ? `el ${new Date(resetAt).toLocaleDateString()}` : ''}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}


