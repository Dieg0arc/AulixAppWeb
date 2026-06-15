import type { Config } from 'tailwindcss'

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // --- Tokens semánticos de UI (cambian por tema, leen CSS vars) ---
        canvas:       withOpacity('--canvas'),
        surface:      withOpacity('--surface'),
        subtle:       withOpacity('--subtle'),
        ink:          withOpacity('--text-base'),
        faint:        withOpacity('--text-muted'),
        'accent-soft': withOpacity('--accent-soft'),
        default:      withOpacity('--border'),      // usar como border-default
        primary:      withOpacity('--primary'),
        'on-primary': withOpacity('--primary-fg'),

        // --- Colores de marca (físicos, constantes en ambos temas) ---
        cobalto: '#2C5BA8',  // acento de marca
        cobre:   '#B36A2E',  // acento
        ok:      '#16A34A',
        danger:  '#DC2626',
        warn:    '#D97706',
        rol: {
          docente:    '#2C5BA8',
          estudiante: '#0891B2',
          auxiliar:   '#059669',
          soporte:    '#B36A2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
