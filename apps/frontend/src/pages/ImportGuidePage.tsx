import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImportGuidePage() {
  const sampleData = `Nombre,Precio,Descripción,Categoría,Stock,SKU
iPhone 15 Pro,45000,Smartphone Apple con chip A17 Pro,Electrónicos,10,IPH15PRO-128GB
Samsung Galaxy S24,38000,Smartphone Android con IA,Samsung,15,GAL-S24-256GB
MacBook Air M2,65000,Laptop Apple con chip M2,Computadoras,5,MBA-M2-512GB
AirPods Pro,8500,Audífonos inalámbricos Apple,Audio,20,AIRPODS-PRO-2
iPad Air,32000,Tablet Apple con pantalla Liquid Retina,Tablets,8,IPAD-AIR-64GB`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/panel" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al panel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Guía de Importación</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <Upload className="h-8 w-8 text-brand-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Importar productos desde CSV/Excel</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Puedes importar múltiples productos de una vez usando un archivo CSV o Excel. 
              Esto es ideal si ya tienes un catálogo de productos en una hoja de cálculo.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">¿No tienes un archivo CSV?</h3>
                  <p className="text-blue-800 text-sm">
                    Puedes crear uno fácilmente en Excel, Google Sheets o cualquier editor de texto. 
                    Descarga nuestra plantilla de ejemplo para empezar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pasos para importar</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prepara tu archivo</h4>
                  <p className="text-gray-600 mb-3">
                    Descarga nuestra plantilla CSV o crea tu propio archivo con las columnas requeridas.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar plantilla CSV
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Llena tus datos</h4>
                  <p className="text-gray-600">
                    Completa la información de tus productos en el archivo. 
                    Asegúrate de que los nombres y precios estén correctos.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sube el archivo</h4>
                  <p className="text-gray-600 mb-3">
                    Selecciona tu archivo CSV o Excel y súbelo a través del botón de importar.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar productos
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Revisa y confirma</h4>
                  <p className="text-gray-600">
                    Revisa los productos importados y confirma que todo esté correcto antes de guardar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Required columns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Columnas requeridas</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Columna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requerido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Nombre
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sí
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Nombre del producto
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Precio
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sí
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Precio en pesos dominicanos (sin símbolo $)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Descripción
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Descripción detallada del producto
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Categoría
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Categoría del producto
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Stock
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Cantidad disponible en inventario
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      SKU
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Código único del producto
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sample data */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ejemplo de archivo CSV</h3>
            <p className="text-gray-600 mb-4">
              Aquí tienes un ejemplo de cómo debería verse tu archivo CSV:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{sampleData}</pre>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Consejos importantes</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Usa comillas para texto con comas</h4>
                  <p className="text-gray-600 text-sm">Si tu descripción contiene comas, enciérrala entre comillas dobles.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Formato de precios</h4>
                  <p className="text-gray-600 text-sm">Usa solo números para los precios (ej: 25000 en lugar de $25,000).</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Límite de productos</h4>
                  <p className="text-gray-600 text-sm">Puedes importar hasta 1000 productos por archivo.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Tamaño del archivo</h4>
                  <p className="text-gray-600 text-sm">El archivo no debe exceder los 10MB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/panel"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Volver al panel
            </Link>
            <button className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
              <Upload className="h-4 w-4 mr-2 inline" />
              Importar productos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
