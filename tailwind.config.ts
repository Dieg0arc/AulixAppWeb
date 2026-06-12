import type { Config } from 'tailwindcss'

export default {
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
        lienzo:  '#FAF8F3',  // fondo
        surface: '#FFFFFF',  // superficies
        arena:   '#F3EDDE',  // secundario
        cobalto: '#2C5BA8',  // primario
        cobre:   '#B36A2E',  // acento
        cielo:   '#DCE7F5',  // chips / hover
        tinta:   '#0F2742',  // texto
        muted:   '#6B7E96',
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
