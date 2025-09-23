import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MessageCircle, ShoppingBag, Bot, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navegación */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-brand-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                EsDeTienda
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-brand-500 transition-colors"
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Tu tienda y tu WhatsApp
              <br />
              <span className="text-brand-100">vendiendo 24/7</span>
              <br />
              sin escribir todo el día
            </h1>
            <p className="text-xl md:text-2xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Crea tu tienda en minutos, conecta tu WhatsApp y automatiza lo repetido. 
              IA solo cuando hace falta.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="#pricing" 
                className="bg-brand-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                Crear mi tienda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-900 transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Beneficios rápidos */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <MessageCircle className="h-12 w-12 text-brand-100 mb-3" />
                <h3 className="font-semibold mb-2">Ahorra tiempo</h3>
                <p className="text-brand-100 text-sm">Bot responde automáticamente las preguntas frecuentes</p>
              </div>
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-12 w-12 text-brand-100 mb-3" />
                <h3 className="font-semibold mb-2">Más ventas desde WhatsApp</h3>
                <p className="text-brand-100 text-sm">Catálogo integrado con carrito directo a WhatsApp</p>
              </div>
              <div className="flex flex-col items-center">
                <BarChart3 className="h-12 w-12 text-brand-100 mb-3" />
                <h3 className="font-semibold mb-2">Sin sorpresas de costo</h3>
                <p className="text-brand-100 text-sm">Plan fijo mensual, caps claros en IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900 mb-16">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Regístrate</h3>
              <p className="text-gray-600">Crea tu cuenta y elige tu plan. Setup en menos de 5 minutos.</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Sube productos</h3>
              <p className="text-gray-600">Importa desde CSV, Google Sheets o sube manualmente tu catálogo.</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Activa tu WhatsApp</h3>
              <p className="text-gray-600">Configuramos tu bot en 24 horas. Empieza a vender automatizado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900 mb-16">
            Todo lo que necesitas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div key={index} className="bg-white p-6 rounded-2xl border border-brand-100 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-brand-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-900 mb-4">
            Planes de pago
          </h2>
          <p className="text-center text-gray-600 mb-16">Sin freemium. Elige el plan que mejor se adapte a tu negocio.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Esencial */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-100 hover:border-brand-500 transition-colors">
              <h3 className="text-2xl font-bold text-brand-900 mb-2">Plan Esencial</h3>
              <div className="text-4xl font-bold text-brand-900 mb-6">
                RD$1,000<span className="text-lg text-gray-600">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tienda + catálogo (hasta 500 SKUs)",
                  "Bot de botones + FAQs",
                  "IA texto 10,000 turnos/mes",
                  "Audios→texto 100 min/mes",
                  "Analytics básicos",
                  "1 usuario admin"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-brand-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/registro?plan=esencial" 
                className="block w-full bg-brand-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
              >
                Empezar con Esencial
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-accent relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-accent text-white px-4 py-1 rounded-full text-sm font-semibold">Recomendado</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-900 mb-2">Plan Pro</h3>
              <div className="text-4xl font-bold text-brand-900 mb-6">
                RD$2,000<span className="text-lg text-gray-600">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Todo del Plan Esencial +",
                  "Búsqueda mejorada (Typesense)",
                  "IA texto 20,000 turnos/mes",
                  "IA visión 1,000 imágenes/mes",
                  "Audios→texto 300 min/mes",
                  "3 usuarios admin",
                  "Subdominio de marca (opcional)"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-brand-accent mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/registro?plan=pro" 
                className="block w-full bg-brand-accent text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Empezar con Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">EsDeTienda</div>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 mb-6">
              <a href="mailto:soporte@esdetienda.com" className="text-brand-100 hover:text-white">
                soporte@esdetienda.com
              </a>
              <Link to="/terminos" className="text-brand-100 hover:text-white">Términos</Link>
              <Link to="/privacidad" className="text-brand-100 hover:text-white">Privacidad</Link>
            </div>
            <p className="text-brand-100 text-sm">
              © 2025 EsDeTienda. Tu tienda virtual con WhatsApp Bot.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
