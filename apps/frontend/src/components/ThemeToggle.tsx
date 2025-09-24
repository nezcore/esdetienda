import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <label className="switch" htmlFor="theme-toggle" id="theme-toggle-button">
      <input
        id="theme-toggle"
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Cambiar tema"
      />
      <span className="slider">
        <span className="circle" />
      </span>
    </label>
  )
}