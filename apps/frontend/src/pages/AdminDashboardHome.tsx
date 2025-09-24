import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<{ tenants: number; users: number; products: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message || 'Error cargando estadísticas')
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {error && <div className="col-span-full text-red-600 dark:text-red-300">{error}</div>}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <p className="text-sm text-gray-500">Tiendas</p>
        <p className="mt-2 text-3xl font-bold">{stats?.tenants ?? '—'}</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <p className="text-sm text-gray-500">Usuarios</p>
        <p className="mt-2 text-3xl font-bold">{stats?.users ?? '—'}</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <p className="text-sm text-gray-500">Productos</p>
        <p className="mt-2 text-3xl font-bold">{stats?.products ?? '—'}</p>
      </div>
    </div>
  )
}


