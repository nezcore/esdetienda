import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Package,
  MessageCircle,
  Settings,
  Upload,
  Plus
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../lib/api'

export default function DashboardHome() {
  const { tenant } = useAuth()
  const location = useLocation()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const productAdded = useMemo(() => new URLSearchParams(location.search).get('product_added') === 'true', [location.search])

  useEffect(() => {
    const load = async () => {
      if (!tenant?.id) return
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/products?tenantId=${tenant.id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
      } catch (e) {
        // noop
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenant?.id])

  const stats = [
    { title: 'Productos', value: String(products.length), icon: Package, change: '+0%' },
    { title: 'Consultas hoy', value: '0', icon: MessageCircle, change: '+0%' },
    { title: 'Visitas', value: '0', icon: BarChart3, change: '+0%' },
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center dark:bg-brand-500/20">
                <stat.icon className="h-6 w-6 text-brand-500 dark:text-brand-200" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">{stat.change} vs ayer</p>
          </div>
        ))}
      </div>

      {productAdded && (
        <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
          Producto creado correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Catálogo de productos
              </h3>
              <div className="flex space-x-2">
                <Link
                  to="/panel/agregar-producto"
                  className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Link>
                <Link
                  to="/panel/guia-importacion"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Link>
              </div>
            </div>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                <h4 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                  No tienes productos aún
                </h4>
                <p className="text-gray-600 mb-4 dark:text-gray-300">
                  Sube tu primer producto o importa un catálogo completo desde CSV/Excel
                </p>
                <div className="space-y-2">
                  <Link
                    to="/panel/agregar-producto"
                    className="inline-block bg-brand-500 text-white px-6 py-2 rounded-xl hover:bg-brand-600 transition-colors"
                  >
                    Agregar producto
                  </Link>
                  <br />
                  <Link
                    to="/panel/guia-importacion"
                    className="text-brand-500 hover:text-brand-700 text-sm"
                  >
                    Ver guía de inicio →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.slice(0, 6).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden grid place-items-center">
                      {Array.isArray(p.images) && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.category || 'Sin categoría'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Configuración */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-brand-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp Bot</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pendiente configuración</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs dark:bg-yellow-900/30 dark:text-yellow-400">
                  Pendiente
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-brand-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Configuración general</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Datos del negocio, colores</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Función de configuración próximamente disponible')}
                  className="text-brand-500 hover:text-brand-700 text-sm"
                >
                  Configurar
                </button>
              </div>

              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 dark:bg-brand-500/10 dark:border-brand-500/30">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-brand-500 rounded-full mt-2"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-brand-900 dark:text-brand-200">
                      Tu bot estará listo en 24 horas
                    </h4>
                    <p className="text-sm text-brand-700 mt-1 dark:text-brand-100">
                      Te enviaremos un email cuando esté configurado. Mientras tanto, sube tus productos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
