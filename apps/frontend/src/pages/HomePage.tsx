import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, MessageCircle, ShoppingBag, Bot, BarChart3, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Efecto máquina de escribir para el hero
  const dynamicTexts = [
    'vendiendo 24/7',
    'trabajando por ti',
    'siempre disponible',
    'nunca descansan',
    'en piloto automático'
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
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-relaxed mb-6 md:mb-8 text-white">
              Tu tienda y tu WhatsApp
              <br />
              <span className="text-white inline-block mt-0 md:mt-2 mb-3 md:mb-8">
                {displayedText}
                <span className="inline-block w-0.5 h-[0.9em] bg-white ml-1" style={{animation: 'blink 1s infinite'}}></span>
              </span>
              <br className="hidden sm:block" />
              <span className="inline-block text-gray-800 dark:text-orange-300 font-semibold bg-white/90 dark:bg-orange-500/15 px-8 py-4 rounded-full backdrop-blur-sm border border-gray-300/60 dark:border-orange-400/30 text-lg sm:text-2xl shadow-lg whitespace-nowrap">Automatizado y sin complicaciones</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 dark:text-brand-200/90 mb-8 md:mb-12 max-w-4xl mx-auto px-2 leading-relaxed">
              Crea tu tienda en minutos, conecta tu WhatsApp y automatiza lo repetido. 
              <span className="block mt-2 text-lg md:text-xl text-white/85 dark:text-white/80">Inteligencia artificial solo cuando hace falta.</span>
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
              <div className="group flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-2xl backdrop-blur-md border border-purple-300/30 dark:border-purple-400/40 hover:from-purple-500/30 hover:to-pink-500/30 dark:hover:from-purple-600/40 dark:hover:to-pink-600/40 hover:border-purple-300/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                  <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Ahorra tiempo</h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">Bot responde automáticamente las preguntas frecuentes</p>
              </div>
              <div className="group flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-600/30 dark:to-teal-600/30 rounded-2xl backdrop-blur-md border border-emerald-300/30 dark:border-emerald-400/40 hover:from-emerald-500/30 hover:to-teal-500/30 dark:hover:from-emerald-600/40 dark:hover:to-teal-600/40 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                  <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Más ventas desde WhatsApp</h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">Catálogo integrado con carrito directo a WhatsApp</p>
              </div>
              <div className="group flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-600/30 dark:to-red-600/30 rounded-2xl backdrop-blur-md border border-orange-300/30 dark:border-orange-400/40 hover:from-orange-500/30 hover:to-red-500/30 dark:hover:from-orange-600/40 dark:hover:to-red-600/40 hover:border-orange-300/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 sm:col-span-2 md:col-span-1">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                  <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg md:text-xl text-white">Sin sorpresas de costo</h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">Plan fijo mensual, caps claros en IA</p>
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
            <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/60 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-blue-200/50 dark:border-blue-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">1</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Regístrate</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Crea tu cuenta y elige tu plan. Setup en menos de 5 minutos.</p>
              </div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-emerald-50 to-green-100/60 dark:from-emerald-900/40 dark:to-green-900/60 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-emerald-200/50 dark:border-emerald-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all duration-300">2</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">Sube productos</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Importa desde CSV, Google Sheets o sube manualmente tu catálogo.</p>
              </div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-violet-50 to-purple-100/60 dark:from-violet-900/40 dark:to-purple-900/60 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-violet-200/50 dark:border-violet-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold mx-auto mb-6 shadow-lg shadow-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/40 group-hover:scale-110 transition-all duration-300">3</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">Activa tu WhatsApp</h3>
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
                desc: "Tu tienda se ve perfecta en móvil y desktop",
                bgGradient: "from-rose-50 to-pink-100/60 dark:from-rose-900/40 dark:to-pink-900/60",
                iconGradient: "from-rose-500 to-pink-600",
                borderColor: "border-rose-200/50 dark:border-rose-700/50",
                hoverShadow: "hover:shadow-rose-500/20",
                hoverBg: "from-rose-500/10 to-pink-500/10",
                hoverText: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
                iconShadow: "shadow-rose-500/25 group-hover:shadow-rose-500/30"
              },
              {
                icon: MessageCircle,
                title: "Bot de WhatsApp",
                desc: "Respuestas automáticas inteligentes las 24 horas",
                bgGradient: "from-cyan-50 to-blue-100/60 dark:from-cyan-900/40 dark:to-blue-900/60",
                iconGradient: "from-cyan-500 to-blue-600",
                borderColor: "border-cyan-200/50 dark:border-cyan-700/50",
                hoverShadow: "hover:shadow-cyan-500/20",
                hoverBg: "from-cyan-500/10 to-blue-500/10",
                hoverText: "group-hover:text-cyan-700 dark:group-hover:text-cyan-300",
                iconShadow: "shadow-cyan-500/25 group-hover:shadow-cyan-500/30"
              },
              {
                icon: Bot,
                title: "Asistente inteligente",
                desc: "Entiende fotos, audios y preguntas de tus clientes",
                bgGradient: "from-amber-50 to-orange-100/60 dark:from-amber-900/40 dark:to-orange-900/60",
                iconGradient: "from-amber-500 to-orange-600",
                borderColor: "border-amber-200/50 dark:border-amber-700/50",
                hoverShadow: "hover:shadow-amber-500/20",
                hoverBg: "from-amber-500/10 to-orange-500/10",
                hoverText: "group-hover:text-amber-700 dark:group-hover:text-amber-300",
                iconShadow: "shadow-amber-500/25 group-hover:shadow-amber-500/30"
              }
            ].map((feature, index) => (
              <div key={index} className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl border ${feature.borderColor} hover:shadow-2xl ${feature.hoverShadow} transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${feature.iconShadow} group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 md:h-9 md:w-9 text-white" />
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white ${feature.hoverText} transition-colors`}>{feature.title}</h3>
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
            <div className="group relative bg-gradient-to-br from-slate-50 to-blue-50/80 dark:from-slate-800 dark:to-blue-900/50 rounded-3xl p-8 border-2 border-slate-200/60 dark:border-slate-600/60 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Plan Esencial</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-200">RD$1,000</span>
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
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-slate-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/registro?plan=esencial" 
                  className="block w-full bg-gradient-to-r from-blue-500 to-slate-600 text-white text-center py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-slate-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Empezar con Esencial
                </Link>
              </div>
            </div>

            {/* Plan Pro */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-red-50/80 dark:from-orange-900/60 dark:to-red-900/40 rounded-3xl p-8 border-2 border-orange-200/60 dark:border-orange-600/60 hover:border-orange-400 dark:hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-orange-500/40 text-sm">
                  ⭐ Recomendado
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-orange-900 dark:text-orange-200 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">Plan Pro</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-bold text-orange-900 dark:text-orange-200">RD$2,000</span>
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
                      <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/registro?plan=pro" 
                  className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-4 rounded-2xl font-bold hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 text-lg"
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
