import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  storeTheme: StoreTheme
  setStoreTheme: (theme: StoreTheme) => void
}

interface StoreTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  cardColor: string
  borderColor: string
  gradientFrom: string
  gradientTo: string
  fontFamily: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  layout: 'grid' | 'list' | 'masonry'
  headerStyle: 'minimal' | 'gradient' | 'image' | 'video'
  showSocialLinks: boolean
  showSearch: boolean
  showCategories: boolean
}

const defaultLightTheme: StoreTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  accentColor: '#F59E0B',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  cardColor: '#FFFFFF',
  borderColor: '#E5E7EB',
  gradientFrom: '#3B82F6',
  gradientTo: '#1E40AF',
  fontFamily: 'Inter',
  borderRadius: 'lg',
  layout: 'grid',
  headerStyle: 'gradient',
  showSocialLinks: true,
  showSearch: true,
  showCategories: true
}

const defaultDarkTheme: StoreTheme = {
  primaryColor: '#60A5FA',
  secondaryColor: '#3B82F6',
  accentColor: '#FBBF24',
  backgroundColor: '#111827',
  textColor: '#F9FAFB',
  cardColor: '#1F2937',
  borderColor: '#374151',
  gradientFrom: '#60A5FA',
  gradientTo: '#3B82F6',
  fontFamily: 'Inter',
  borderRadius: 'lg',
  layout: 'grid',
  headerStyle: 'gradient',
  showSocialLinks: true,
  showSearch: true,
  showCategories: true
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: Partial<StoreTheme>
}

export function ThemeProvider({ children, initialTheme = {} }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false)
  const [storeTheme, setStoreTheme] = useState<StoreTheme>({
    ...defaultLightTheme,
    ...initialTheme
  })

  useEffect(() => {
    // Detectar preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Aplicar tema al document
    const theme = isDark ? { ...storeTheme, ...defaultDarkTheme } : storeTheme
    
    document.documentElement.style.setProperty('--store-primary', theme.primaryColor)
    document.documentElement.style.setProperty('--store-secondary', theme.secondaryColor)
    document.documentElement.style.setProperty('--store-accent', theme.accentColor)
    document.documentElement.style.setProperty('--store-bg', theme.backgroundColor)
    document.documentElement.style.setProperty('--store-text', theme.textColor)
    document.documentElement.style.setProperty('--store-card', theme.cardColor)
    document.documentElement.style.setProperty('--store-border', theme.borderColor)
    document.documentElement.style.setProperty('--store-gradient-from', theme.gradientFrom)
    document.documentElement.style.setProperty('--store-gradient-to', theme.gradientTo)
  }, [isDark, storeTheme])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const updateStoreTheme = (newTheme: StoreTheme) => {
    setStoreTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      storeTheme: isDark ? { ...storeTheme, ...defaultDarkTheme } : storeTheme,
      setStoreTheme: updateStoreTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
