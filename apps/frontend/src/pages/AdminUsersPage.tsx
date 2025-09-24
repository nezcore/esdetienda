import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

type User = { id: string; email: string; tenant_id: string; role: string; status: string; created_at: string }

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setItems(data.items)
      } catch (e: any) {
        setError(e.message || 'Error cargando usuarios')
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 dark:text-red-300">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Tenant</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Creado</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-2 font-semibold">{u.email}</td>
                <td className="px-4 py-2">{u.tenant_id}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.status}</td>
                <td className="px-4 py-2">{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


