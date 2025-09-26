interface StoreLogoProps {
  logo?: string
  icon?: string
  storeName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
}

export default function StoreLogo({ 
  logo, 
  icon, 
  storeName, 
  size = 'md', 
  className = '',
  onClick 
}: StoreLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  }

  const isClickable = !!onClick
  const baseClasses = `${sizeClasses[size]} rounded-xl flex items-center justify-center shadow-sm ${className}`
  const interactiveClasses = isClickable 
    ? 'cursor-pointer hover:scale-105 transition-transform' 
    : 'cursor-default'

  if (logo) {
    // Imagen personalizada
    return (
      <div 
        className={`${baseClasses} overflow-hidden ${interactiveClasses}`}
        onClick={onClick}
      >
        <img 
          src={logo} 
          alt={`Logo de ${storeName}`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  if (icon) {
    // Emoji/icono personalizado
    return (
      <div 
        className={`${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600 ${interactiveClasses}`}
        onClick={onClick}
      >
        <span className="text-white font-bold">
          {icon}
        </span>
      </div>
    )
  }

  // Fallback - inicial del nombre de la tienda
  return (
    <div 
      className={`${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600 ${interactiveClasses}`}
      onClick={onClick}
    >
      <span className="text-white font-bold">
        {storeName.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
