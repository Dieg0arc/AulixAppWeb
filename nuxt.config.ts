// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SPA — app interna tras login, sin SEO. Sin SSR.
  ssr: false,

  // Módulos del stack
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  // CSS global (Tailwind entra por aquí)
  css: ['~/assets/css/main.css'],

  // Variables de entorno expuestas al cliente.
  // Los valores reales viven en .env (no se commitea).
  runtimeConfig: {
    public: {
      apiBase: '',   // ← NUXT_PUBLIC_API_BASE
      wsUrl: '',     // ← NUXT_PUBLIC_WS_URL
    },
  },

  // Inter desde Google Fonts
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
