import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MessageCircle, ShoppingBag, Bot, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Navegación */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-brand-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                EsDeTienda
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/registro" 
                className="bg-brand-900 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
              >
                Crear mi tienda
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="bg-brand-900 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors mx-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Crear mi tienda
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-hero-gradient dark:from-brand-700 dark:to-brand-900 text-white py-12 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              Tu tienda y tu WhatsApp
              <br />
              <span className="text-brand-100 dark:text-brand-300">vendiendo 24/7</span>
              <br className="hidden sm:block" />
              <span className="block sm:inline">sin escribir todo el día</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-brand-100 dark:text-brand-200 mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Crea tu tienda en minutos, conecta tu WhatsApp y automatiza lo repetido. 
              IA solo cuando hace falta.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
              <Link 
                to="#pricing" 
                className="bg-brand-accent text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center text-sm md:text-base"
              >
                Crear mi tienda
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-900 transition-colors text-sm md:text-base"
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Beneficios rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center px-4">
              <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
                <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-brand-100 dark:text-brand-300 mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Ahorra tiempo</h3>
                <p className="text-brand-100 dark:text-brand-200 text-xs md:text-sm">Bot responde automáticamente las preguntas frecuentes</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-brand-100 dark:text-brand-300 mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Más ventas desde WhatsApp</h3>
                <p className="text-brand-100 dark:text-brand-200 text-xs md:text-sm">Catálogo integrado con carrito directo a WhatsApp</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm sm:col-span-2 md:col-span-1">
                <BarChart3 className="h-10 w-10 md:h-12 md:w-12 text-brand-100 dark:text-brand-300 mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Sin sorpresas de costo</h3>
                <p className="text-brand-100 dark:text-brand-200 text-xs md:text-sm">Plan fijo mensual, caps claros en IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-brand-900 dark:text-brand-300 mb-8 md:mb-16">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="bg-brand-500 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">Regístrate</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Crea tu cuenta y elige tu plan. Setup en menos de 5 minutos.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="bg-brand-500 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sube productos</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Importa desde CSV, Google Sheets o sube manualmente tu catálogo.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="bg-brand-500 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">Activa tu WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Configuramos tu bot en 24 horas. Empieza a vender automatizado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-brand-900 dark:text-brand-300 mb-8 md:mb-16">
            Todo lo que necesitas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Catálogo responsive",
                desc: "Tu tienda se ve perfecta en móvil y desktop"
              },
              {
                icon: MessageCircle,
                title: "Bot de botones",
                desc: "Flujo guiado con botones para consultas frecuentes"
              },
              {
                icon: Bot,
                title: "IA fallback",
                desc: "IA entra cuando el cliente escribe libre o manda foto"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl border border-brand-100 dark:border-gray-600 hover:shadow-lg transition-all hover:scale-105">
                <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-brand-500 dark:text-brand-400 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-brand-900 dark:text-brand-300 mb-4">
            Planes de pago
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-16 text-sm md:text-base">Sin freemium. Elige el plan que mejor se adapte a tu negocio.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Plan Esencial */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border-2 border-brand-100 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-400 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-brand-900 dark:text-brand-300 mb-2">Plan Esencial</h3>
              <div className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-brand-300 mb-4 md:mb-6">
                RD$1,000<span className="text-base md:text-lg text-gray-600 dark:text-gray-400">/mes</span>
              </div>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[
                  "Tienda + catálogo (hasta 500 SKUs)",
                  "Bot de botones + FAQs",
                  "IA texto 10,000 turnos/mes",
                  "Audios→texto 100 min/mes",
                  "Analytics básicos",
                  "1 usuario admin"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-brand-500 dark:text-brand-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/registro?plan=esencial" 
                className="block w-full bg-brand-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors text-sm md:text-base"
              >
                Empezar con Esencial
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border-2 border-brand-accent dark:border-brand-accent relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-accent text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold">Recomendado</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-brand-900 dark:text-brand-300 mb-2">Plan Pro</h3>
              <div className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-brand-300 mb-4 md:mb-6">
                RD$2,000<span className="text-base md:text-lg text-gray-600 dark:text-gray-400">/mes</span>
              </div>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[
                  "Todo del Plan Esencial +",
                  "Búsqueda mejorada (Typesense)",
                  "IA texto 20,000 turnos/mes",
                  "IA visión 1,000 imágenes/mes",
                  "Audios→texto 300 min/mes",
                  "3 usuarios admin",
                  "Subdominio de marca (opcional)"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-brand-accent mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/registro?plan=pro" 
                className="block w-full bg-brand-accent text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm md:text-base"
              >
                Empezar con Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 dark:bg-gray-950 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold mb-4 bg-brand-gradient bg-clip-text text-transparent">
              EsDeTienda
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8 mb-6">
              <a 
                href="mailto:soporte@esdetienda.com" 
                className="text-brand-100 dark:text-brand-200 hover:text-white transition-colors text-sm md:text-base"
              >
                soporte@esdetienda.com
              </a>
              <Link 
                to="/terminos" 
                className="text-brand-100 dark:text-brand-200 hover:text-white transition-colors text-sm md:text-base"
              >
                Términos
              </Link>
              <Link 
                to="/privacidad" 
                className="text-brand-100 dark:text-brand-200 hover:text-white transition-colors text-sm md:text-base"
              >
                Privacidad
              </Link>
            </div>
            <p className="text-brand-100 dark:text-brand-200 text-xs md:text-sm">
              © 2025 EsDeTienda. Tu tienda virtual con WhatsApp Bot.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
