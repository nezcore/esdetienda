import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import ProductViewModal from '../components/ProductViewModal'
import ProductEditModal from '../components/ProductEditModal'
import { 
  Package, 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  CheckSquare,
  Square,
  X,
  AlertTriangle
} from 'lucide-react'

type Product = {
  id: string
  name: string
  description?: string
  price?: number
  category?: string
  images?: string[]
  stock?: number
  status?: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
  updated_at?: string
}

type ViewMode = 'grid' | 'list'
type SortField = 'name' | 'category' | 'created_at' | 'price'
type SortOrder = 'asc' | 'desc'

export default function ProductsListPageNew() {
  const { tenant } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Vista y filtros
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  // Selección múltiple
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [productToView, setProductToView] = useState<Product | null>(null)

  // Cargar productos
  useEffect(() => {
    loadProducts()
  }, [tenant?.id])

  const loadProducts = async () => {
      if (!tenant?.id) return
      setLoading(true)
      setError(null)
      try {
      const response = await api.get<{products: Product[]}>(`/products?tenantId=${tenant.id}`)
      setProducts(response.products || [])
      } catch (e: any) {
        setError(e.message || 'Error cargando productos')
      } finally {
        setLoading(false)
      }
    }

  // Filtros y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue?.toLowerCase() || ''
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [products, searchQuery, categoryFilter, sortField, sortOrder])

  // Categorías únicas para filtro
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(cats)
  }, [products])

  // Manejo de selección
  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  const selectAllProducts = () => {
    if (selectedProducts.size === filteredAndSortedProducts.length) {
      setSelectedProducts(new Set())
      setShowBulkActions(false)
    } else {
      setSelectedProducts(new Set(filteredAndSortedProducts.map(p => p.id)))
      setShowBulkActions(true)
    }
  }

  // Acciones CRUD
  const handleDeleteProduct = async (product: Product) => {
    try {
      await api.delete(`/products/${product.id}?tenantId=${tenant?.id}`)
      setProducts(prev => prev.filter(p => p.id !== product.id))
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (e: any) {
      setError(e.message || 'Error eliminando producto')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedProducts).map(id => api.delete(`/products/${id}?tenantId=${tenant?.id}`))
      )
      setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)))
      setSelectedProducts(new Set())
      setShowBulkActions(false)
    } catch (e: any) {
      setError(e.message || 'Error eliminando productos')
    }
  }

  const handleViewProduct = (product: Product) => {
    setProductToView(product)
    setShowViewModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setShowEditModal(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'Sin precio'
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">Sin stock</span>
    }
    if (product.status === 'inactive') {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Inactivo</span>
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">Activo</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tu catálogo de productos ({filteredAndSortedProducts.length} productos)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/panel/agregar-producto" 
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600 transition-colors"
          >
          <Plus className="h-4 w-4" /> Agregar producto
        </Link>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortField(field as SortField)
                setSortOrder(order as SortOrder)
              }}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="created_at-desc">Más recientes</option>
              <option value="created_at-asc">Más antiguos</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="price-asc">Precio menor</option>
              <option value="price-desc">Precio mayor</option>
            </select>

            {/* Toggle vista */}
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Acciones en lote */}
        {showBulkActions && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProducts.size} productos seleccionados
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar seleccionados
                </button>
                <button
                  onClick={() => {
                    setSelectedProducts(new Set())
                    setShowBulkActions(false)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl dark:border-gray-700">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-300">
            {searchQuery || categoryFilter ? 'No se encontraron productos con los filtros aplicados.' : 'Aún no hay productos.'}
          </p>
          {!searchQuery && !categoryFilter && (
            <Link 
              to="/panel/agregar-producto"
              className="inline-flex items-center gap-2 mt-4 text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <Plus className="h-4 w-4" />
              Agregar tu primer producto
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Vista Grid */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Checkbox de selección */}
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      onClick={() => toggleSelectProduct(product.id)}
                      className="p-1 rounded bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900"
                    >
                      {selectedProducts.has(product.id) ? (
                        <CheckSquare className="h-4 w-4 text-brand-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Imagen */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Acciones hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleViewProduct(product)}
                          className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button 
                          onClick={() => {
                            setProductToDelete(product)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
                        {product.name}
                      </h3>
                      {getStatusBadge(product)}
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {product.category || 'Sin categoría'}
                      </span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    {product.stock !== undefined && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Stock: {product.stock} unidades
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Creado: {formatDate(product.created_at)}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-brand-600 hover:text-brand-700 dark:text-brand-400"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => {
                              setProductToDelete(product)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vista Lista */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={selectAllProducts}
                          className="p-1"
                        >
                          {selectedProducts.size === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-brand-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Producto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Categoría</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Precio</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Fecha</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSelectProduct(product.id)}
                            className="p-1"
                          >
                            {selectedProducts.has(product.id) ? (
                              <CheckSquare className="h-4 w-4 text-brand-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {product.category || 'Sin categoría'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {product.stock !== undefined ? `${product.stock} unidades` : 'Sin definir'}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(product)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewProduct(product)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setProductToDelete(product)
                                setShowDeleteModal(true)
                              }}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Eliminar producto
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que quieres eliminar "<strong>{productToDelete.name}</strong>"?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista de producto */}
      {showViewModal && productToView && (
        <ProductViewModal
          product={productToView}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setProductToView(null)
          }}
        />
      )}

      {/* Modal de edición de producto */}
      {showEditModal && productToEdit && (
        <ProductEditModal
          product={productToEdit}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setProductToEdit(null)
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}
