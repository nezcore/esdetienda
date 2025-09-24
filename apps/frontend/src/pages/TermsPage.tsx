import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const sections = [
  {
    title: '1. Introducción',
    content:
      'Bienvenido a EsDeTienda. Estos términos regulan la creación y operación de tiendas virtuales, el uso de nuestros bots de WhatsApp y cualquier funcionalidad relacionada con inteligencia artificial. Al utilizar nuestros servicios aceptas estas condiciones en su totalidad.'
  },
  {
    title: '2. Planes y facturación',
    content:
      'Ofrecemos los planes Starter, Grow y Pro. Cada plan incluye capacidades específicas descritas en el proceso de registro y puede actualizarse en cualquier momento. Los cargos recurrentes se procesan de forma mensual y no son reembolsables una vez iniciado el ciclo de facturación.'
  },
  {
    title: '3. Uso aceptable',
    content:
      'Te comprometes a utilizar EsDeTienda solo para fines legales y comerciales legítimos. Está prohibido distribuir contenido malicioso, infringir derechos de autor, realizar spam masivo o cualquier actividad que ponga en riesgo la infraestructura o reputación de la plataforma.'
  },
  {
    title: '4. Privacidad y datos',
    content:
      'Tratamos los datos de tus clientes con confidencialidad. Puedes consultar detalles sobre almacenamiento, retención y tus derechos en nuestra Política de Privacidad. Al integrar WhatsApp aceptas las condiciones de Meta y garantizas que cuentas con autorización para comunicarte con tus clientes.'
  },
  {
    title: '5. Limitaciones de responsabilidad',
    content:
      'Hacemos esfuerzos razonables para mantener la plataforma disponible. Sin embargo, EsDeTienda no será responsable por pérdidas indirectas, interrupciones de terceros o daños derivados del uso inapropiado de la plataforma. El servicio se ofrece “tal cual” y puede actualizarse sin previo aviso.'
  }
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100/60 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-brand-100/60 dark:border-gray-800/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              EsDeTienda
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 dark:from-brand-800 dark:via-brand-700 dark:to-brand-600 px-6 sm:px-10 py-12 text-white shadow-xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10 text-center">
              <p className="text-xs uppercase tracking-[0.35em] font-semibold text-white/80 mb-4">
                Nuestro compromiso contigo
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                Términos y Condiciones de Servicio
              </h1>
              <p className="text-sm md:text-base text-white/80">
                Última actualización: 24 de septiembre de 2025
              </p>
            </div>
          </header>

          <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              {sections.map((section) => (
                <article key={section.title} className="bg-white/90 dark:bg-gray-900/90 border border-white/40 dark:border-gray-800/60 rounded-2xl shadow-lg shadow-brand-900/5 dark:shadow-none px-6 sm:px-8 py-8">
                  <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-200 mb-4">
                    {section.title}
                  </h2>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {section.content}
                  </p>
                </article>
              ))}
              <article className="bg-white/90 dark:bg-gray-900/90 border border-white/40 dark:border-gray-800/60 rounded-2xl shadow-lg shadow-brand-900/5 dark:shadow-none px-6 sm:px-8 py-8">
                <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-200 mb-4">
                  6. Contacto
                </h2>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Si tienes preguntas sobre estos términos, escríbenos a{' '}
                  <a className="text-brand-500 hover:text-brand-700" href="mailto:legal@esdetienda.com">
                    legal@esdetienda.com
                  </a>.
                </p>
              </article>
            </div>

            <aside className="bg-white dark:bg-gray-900 border border-white/60 dark:border-gray-800/60 rounded-2xl shadow-lg p-6 sm:p-8 h-fit sticky top-24 space-y-8">
              <div>
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.35em] mb-3">
                  Tabla de contenidos
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  {sections.map((section) => (
                    <li key={`toc-${section.title}`}>{section.title}</li>
                  ))}
                  <li>6. Contacto</li>
                </ul>
              </div>
              <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-100/70 dark:border-brand-500/30 rounded-xl px-5 py-6">
                <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-2">
                  ¿Necesitas ayuda personalizada?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                  Nuestro equipo legal puede guiarte para integrar EsDeTienda a tu flujo de trabajo.
                </p>
                <a
                  href="mailto:legal@esdetienda.com"
                  className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Escríbenos →
                </a>
              </div>
              <div className="border-t border-dashed border-gray-200 dark:border-gray-800 pt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Estos términos pueden actualizarse en cualquier momento. Te avisaremos cuando realicemos cambios relevantes.
                </p>
              </div>
            </aside>
          </section>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-900 text-white font-semibold hover:bg-brand-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

