import { useState } from 'react'
import { Shield, Palette, Layout, Eye, Smartphone, Save } from 'lucide-react'
import StoreCustomizer from '../components/StoreCustomizer'
import { useAuth } from '../contexts/AuthContext'

export default function CustomizationPage() {
  const { tenant } = useAuth()
  const [showCustomizer, setShowCustomizer] = useState(false)

  const handleSaveTheme = async (theme: any) => {
    try {
      // TODO: Guardar tema en la base de datos
      console.log('Guardando tema:', theme)

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Cerrar panel
      setShowCustomizer(false)

      // TODO: Mostrar toast de éxito
      alert('¡Tema guardado exitosamente!')

    } catch (error) {
      console.error('Error guardando tema:', error)
      alert('Error al guardar el tema')
    }
  }

  const openStorePreview = () => {
    if (tenant?.slug) {
      window.open(`/str/${tenant.slug}`, '_blank')
    }
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                <span className="font-bold">¡Atención!</span>
                <span>
                  {' '}Para personalizar tu tienda, necesitas estar{' '}
                  <span className="font-bold">logueado</span> como administrador.
                </span>
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Por favor, inicia sesión en tu cuenta de administrador para acceder a las
                  opciones de personalización.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={() => setShowCustomizer(true)}
            className="rounded-full bg-brand-500 text-white px-5 py-2 text-sm font-semibold hover:bg-brand-600"
          >
            <Save className="h-4 w-4" /> Guardar cambios
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <header className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm shadow-black/5 p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1 text-sm font-semibold text-brand-600 dark:text-brand-300">
            <Palette className="h-4 w-4" /> Personalización de tienda
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diseña la experiencia de tu tienda</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
              Ajusta colores, tipografías y layout para que tu tienda tenga el estilo perfecto. Los cambios se aplican inmediatamente y puedes previsualizarlos antes de publicarlos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <Palette className="h-4 w-4 text-brand-500" /> Paletas profesionales
            </span>
            <span className="inline-flex items-center gap-2">
              <Layout className="h-4 w-4 text-brand-500" /> Layouts responsivos
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-500" /> Previsualización en vivo
            </span>
            <span className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-brand-500" /> Optimizado para móvil
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowCustomizer(true)}
            className="rounded-full bg-brand-600 text-white px-6 py-3 text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Abrir personalizador
          </button>
          <button
            onClick={openStorePreview}
            className="rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Ver tienda actual
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm shadow-black/5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="h-5 w-5 text-brand-500" /> Colores de marca
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Define los colores primario y secundario para toda la tienda. Se aplicarán a botones, títulos y elementos clave de la UI.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-brand-500 to-brand-700 text-white p-4">
              <p className="text-xs uppercase tracking-wide opacity-80">Primario</p>
              <p className="text-lg font-semibold">Color de acción</p>
              <p className="mt-1 text-xs opacity-80">Botones, CTA, enlaces destacados</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4">
              <p className="text-xs uppercase tracking-wide opacity-80">Secundario</p>
              <p className="text-lg font-semibold">Color de soporte</p>
              <p className="mt-1 text-xs opacity-80">Etiquetas, badges, elementos decorativos</p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm shadow-black/5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Layout className="h-5 w-5 text-brand-500" /> Layouts profesionales
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Elige distribuciones modernas enfocadas en conversiones, catálogo y experiencia mobile-first.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
              <p className="font-semibold">Hero compacto</p>
              <p className="text-xs mt-1">Optimizado para destacar promociones y CTA principal.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
              <p className="font-semibold">Catálogo visual</p>
              <p className="text-xs mt-1">Tarjetas con imágenes destacadas y precios visibles.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
              <p className="font-semibold">Secciones dinámicas</p>
              <p className="text-xs mt-1">Testimonios, estadísticas, badges de confianza.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
              <p className="font-semibold">Footer enriquecido</p>
              <p className="text-xs mt-1">Información de contacto, redes sociales y políticas.</p>
            </div>
          </div>
        </article>
      </section>

      <StoreCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        onSave={handleSaveTheme}
      />
    </div>
  )
}
