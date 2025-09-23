import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class", // Habilitar dark mode con clase
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Colores del branding EsDeTienda
        brand: {
          900: '#134572', // Navy - encabezados, navbar, botones primarios
          700: '#1E5B83',
          500: '#27A3A4', // Teal - acciones secundarias, links, chips
          300: '#90BDC0', // Aqua - fondos suaves, badges
          100: '#DEE6E1', // Gray - divisores y fondos claros
          DEFAULT: '#27A3A4',
          accent: '#F79A30' // Accent orange - resaltados, CTAs alternos
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#134572", // brand-900
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#27A3A4", // brand-500
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#DEE6E1", // brand-100
          foreground: "#617687", // gray-600
        },
        accent: {
          DEFAULT: "#F79A30", // brand-accent
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(45deg, #27A3A4, #134572)',
        'hero-gradient': 'linear-gradient(135deg, #27A3A4 0%, #134572 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
