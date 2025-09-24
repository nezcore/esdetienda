import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../lib/api'

export default function AddProductPage() {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: ''
  })
  const navigate = useNavigate()
  const { tenant } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const maxBytes = 4 * 1024 * 1024
      const accepted: string[] = []
      for (const file of Array.from(files)) {
        if (file.size > maxBytes) {
          alert(`La imagen '${file.name}' supera 4MB`)
          continue
        }
        accepted.push(URL.createObjectURL(file))
      }
      if (accepted.length) setImages(prev => [...prev, ...accepted])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!tenant?.id) {
        alert('Tenant no definido')
        return
      }
      const fileInput = document.getElementById('image-upload') as HTMLInputElement | null
      const files = fileInput?.files
      if (!files || files.length === 0) {
        alert('Debes seleccionar al menos una imagen (máx 4MB cada una)')
        return
      }

      const fd = new FormData()
      fd.append('tenantId', tenant.id)
      fd.append('name', formData.name)
      if (formData.description) fd.append('description', formData.description)
      if (formData.price) fd.append('price', String(formData.price))
      fd.append('category', formData.category)
      if (formData.stock) fd.append('stock', String(formData.stock))
      Array.from(files).forEach(f => fd.append('images', f))

      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } as any : undefined,
        body: fd
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      await res.json()
      navigate('/panel?product_added=true')
    } catch (error) {
      console.error('Error al crear producto:', error)
      alert('Error al crear el producto. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Electrónicos',
    'Ropa y Accesorios',
    'Hogar y Jardín',
    'Deportes',
    'Libros',
    'Juguetes',
    'Belleza',
    'Automotriz',
    'Otros'
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agregar Producto</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Completa la información de tu nuevo producto</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="p-8">
            {/* Información básica */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Información básica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Ej: iPhone 15 Pro"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU / Código
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Ej: IPH15PRO-128GB"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio (RD$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Describe las características y beneficios del producto..."
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Imágenes del producto</h2>
              
              <div className="space-y-4">
                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors dark:border-gray-700 dark:hover:border-gray-600">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">PNG, JPG hasta 4MB cada una</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Seleccionar imágenes
                  </label>
                </div>

                {/* Image previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link
                to="/panel"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.price}
                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar producto
                  </>
                )}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}
