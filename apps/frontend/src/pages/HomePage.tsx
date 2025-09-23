import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MessageCircle, ShoppingBag, Bot, BarChart3, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Efecto máquina de escribir para el hero
  const dynamicTexts = [
    'vendiendo 24/7',
    'activo todo el tiempo',
    'trabajando por ti',
    'siempre disponible',
    'nunca descansa',
    'en piloto automático',
    'sin descanso',
    'round the clock'
  ]
  
  const [displayedText, setDisplayedText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  
  useEffect(() => {
    const currentText = dynamicTexts[currentTextIndex]
    let timeout: NodeJS.Timeout | undefined
    
    if (!isDeleting && charIndex < currentText.length) {
      // Escribiendo - agregar siguiente carácter
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 100) // Velocidad de escritura - 100ms por carácter
    } else if (!isDeleting && charIndex === currentText.length) {
      // Texto completo - pausar antes de borrar
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000) // Pausa de 2 segundos cuando termina de escribir
    } else if (isDeleting && charIndex > 0) {
      // Borrando - quitar carácter
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, 50) // Velocidad de borrado - 50ms por carácter (más rápido)
    } else if (isDeleting && charIndex === 0) {
      // Terminó de borrar - cambiar al siguiente texto
      setIsDeleting(false)
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length)
    }
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [charIndex, isDeleting, currentTextIndex, dynamicTexts])

  return (
    <div className="min-h-screen">
      {/* Navegación */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-brand-100/50 dark:border-gray-800/50 sticky top-0 z-50 shadow-lg shadow-brand-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <span className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent drop-shadow-sm">
                  EsDeTienda
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500 to-brand-900 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-all hover:scale-105 font-medium px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-gray-800"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/registro" 
                className="bg-gradient-to-r from-brand-900 to-brand-700 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105 font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10">Crear mi tienda</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 border border-brand-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-800 transition-all hover:scale-105"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg">
              <div className="bg-white/95 dark:bg-gray-900/95 py-6">
                <div className="flex flex-col space-y-4 px-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 dark:text-gray-300 hover:text-brand-500 transition-all hover:scale-105 px-4 py-3 rounded-xl hover:bg-brand-50 dark:hover:bg-gray-800 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/registro" 
                    className="bg-gradient-to-r from-brand-900 to-brand-700 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105 font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Crear mi tienda
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-hero-gradient dark:from-brand-700 dark:to-brand-900 text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/3 rounded-full blur-lg"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 md:mb-8">
              Tu tienda y tu WhatsApp
              <br />
              <span className="text-brand-100 dark:text-brand-300 bg-gradient-to-r from-brand-100 to-white bg-clip-text text-transparent">
                {displayedText}
                <span className="inline-block w-0.5 h-[0.9em] bg-current ml-1" style={{animation: 'blink 1s infinite'}}></span>
              </span>
              <br className="hidden sm:block" />
              <span className="block sm:inline text-white/90">sin escribir todo el día</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-brand-100/90 dark:text-brand-200/90 mb-8 md:mb-12 max-w-4xl mx-auto px-2 leading-relaxed">
              Crea tu tienda en minutos, conecta tu WhatsApp y automatiza lo repetido. 
              <span className="block mt-2 text-lg md:text-xl text-white/80">Inteligencia artificial solo cuando hace falta.</span>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
              <Link 
                to="#pricing" 
                className="group bg-gradient-to-r from-brand-accent to-orange-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold hover:from-orange-600 hover:to-red-500 hover:shadow-2xl hover:shadow-brand-accent/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg md:text-xl"
              >
                <span>Crear mi tienda</span>
                <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white/60 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm text-lg md:text-xl"
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Beneficios rápidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center px-4">
              <div className="group flex flex-col items-center p-6 md:p-8 bg-white/15 dark:bg-gray-800/40 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Ahorra tiempo</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">Bot responde automáticamente las preguntas frecuentes</p>
              </div>
              <div className="group flex flex-col items-center p-6 md:p-8 bg-white/15 dark:bg-gray-800/40 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Más ventas desde WhatsApp</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">Catálogo integrado con carrito directo a WhatsApp</p>
              </div>
              <div className="group flex flex-col items-center p-6 md:p-8 bg-white/15 dark:bg-gray-800/40 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10 sm:col-span-2 md:col-span-1">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Sin sorpresas de costo</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">Plan fijo mensual, caps claros en IA</p>
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
            <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-brand-500/30 group-hover:shadow-xl group-hover:shadow-brand-500/40 group-hover:scale-110 transition-all duration-300">1</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">Regístrate</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Crea tu cuenta y elige tu plan. Setup en menos de 5 minutos.</p>
              </div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-brand-500/30 group-hover:shadow-xl group-hover:shadow-brand-500/40 group-hover:scale-110 transition-all duration-300">2</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">Sube productos</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Importa desde CSV, Google Sheets o sube manualmente tu catálogo.</p>
              </div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-brand-500/30 group-hover:shadow-xl group-hover:shadow-brand-500/40 group-hover:scale-110 transition-all duration-300">3</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">Activa tu WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Configuramos tu bot en 24 horas. Empieza a vender automatizado.</p>
              </div>
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
                title: "Bot de WhatsApp",
                desc: "Respuestas automáticas inteligentes las 24 horas"
              },
              {
                icon: Bot,
                title: "Asistente inteligente",
                desc: "Entiende fotos, audios y preguntas de tus clientes"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 p-8 rounded-3xl border border-brand-100/60 dark:border-gray-600/60 hover:border-brand-300 dark:hover:border-brand-400 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/25 group-hover:shadow-xl group-hover:shadow-brand-500/30 transition-all duration-300">
                    <feature.icon className="h-8 w-8 md:h-9 md:w-9 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{feature.desc}</p>
                </div>
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
            <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-3xl p-8 border-2 border-brand-100/60 dark:border-gray-600/60 hover:border-brand-400 dark:hover:border-brand-400 hover:shadow-2xl hover:shadow-brand-500/15 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-brand-300 group-hover:text-brand-700 dark:group-hover:text-brand-200 transition-colors">Plan Esencial</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-brand-300">RD$1,000</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">/mes</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Perfecto para empezar</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Tienda + catálogo (hasta 500 SKUs)",
                    "Bot de botones + FAQs",
                    "IA texto 10,000 turnos/mes",
                    "Audios→texto 100 min/mes",
                    "Analytics básicos",
                    "1 usuario admin"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/registro?plan=esencial" 
                  className="block w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-center py-4 rounded-2xl font-bold hover:from-brand-600 hover:to-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Empezar con Esencial
                </Link>
              </div>
            </div>

            {/* Plan Pro */}
            <div className="group relative bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 rounded-3xl p-8 border-2 border-brand-accent/60 hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/20 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-brand-accent to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-brand-accent/30 text-sm">
                  ⭐ Recomendado
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-brand-300 group-hover:text-orange-700 dark:group-hover:text-orange-200 transition-colors">Plan Pro</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-brand-300">RD$2,000</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">/mes</span>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 mt-2 font-medium">Máximo rendimiento</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Todo del Plan Esencial +",
                    "Búsqueda mejorada (Typesense)",
                    "IA texto 20,000 turnos/mes",
                    "IA visión 1,000 imágenes/mes",
                    "Audios→texto 300 min/mes",
                    "3 usuarios admin",
                    "Subdominio de marca (opcional)"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="w-5 h-5 bg-gradient-to-br from-brand-accent to-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/registro?plan=pro" 
                  className="block w-full bg-gradient-to-r from-brand-accent to-orange-500 text-white text-center py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-500 hover:shadow-xl hover:shadow-brand-accent/30 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Empezar con Pro
                </Link>
              </div>
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
