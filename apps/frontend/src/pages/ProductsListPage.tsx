import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../lib/api'
import { Package, Plus } from 'lucide-react'

type Product = {
  id: string
  name: string
  category?: string
  images?: string[]
  created_at: string
}

export default function ProductsListPage() {
  const { tenant } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!tenant?.id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE_URL}/products?tenantId=${tenant.id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setItems(Array.isArray(data.products) ? data.products : [])
      } catch (e: any) {
        setError(e.message || 'Error cargando productos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenant?.id])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link to="/panel/agregar-producto" className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600">
          <Plus className="h-4 w-4" /> Agregar producto
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">{error}</div>
      )}

      {loading ? (
        <div>Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl dark:border-gray-700">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-300">Aún no hay productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="h-36 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 grid place-items-center mb-3">
                {Array.isArray(p.images) && p.images.length > 0 ? (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.category || 'Sin categoría'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


