interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

export default function Logo({ className = '', size = 'md', showText = false }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-10',
    xl: 'h-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="EsDeTienda" 
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <span className={`font-bold bg-brand-gradient bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          EsDeTienda
        </span>
      )}
    </div>
  )
}
