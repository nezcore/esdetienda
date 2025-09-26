import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

type Tenant = { id: string; slug: string; business_name: string; plan: string; status: string; created_at: string }

export default function AdminTenantsPage() {
  const [items, setItems] = useState<Tenant[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/tenants`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setItems(data.items)
      } catch (e: any) {
        setError(e.message || 'Error cargando tiendas')
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
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Negocio</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Creado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-2 font-semibold">{t.slug}</td>
                <td className="px-4 py-2">{t.business_name}</td>
                <td className="px-4 py-2">{t.plan}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">{new Date(t.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900"
                      defaultValue=""
                      onChange={async (e) => {
                        const plan = e.target.value as 'esencial'|'grow'|'pro'|''
                        if (!plan) return
                        await fetch(`${API_BASE_URL}/admin/tenants/${t.id}/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) })
                      }}
                    >
                      <option value="" disabled>Cambiar plan</option>
                      <option value="esencial">Starter</option>
                      <option value="grow">Grow</option>
                      <option value="pro">Pro</option>
                    </select>
                    <select
                      className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900"
                      defaultValue=""
                      onChange={async (e) => {
                        const status = e.target.value as 'active'|'inactive'|'suspended'|''
                        if (!status) return
                        await fetch(`${API_BASE_URL}/admin/tenants/${t.id}/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
                      }}
                    >
                      <option value="" disabled>Estado</option>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


