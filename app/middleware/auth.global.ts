import { useAuthStore } from '~/stores/auth'

/** Rutas accesibles sin sesión. */
const PUBLIC_ROUTES = ['/login', '/register']

/**
 * Protege toda la app: si no hay sesión y la ruta no es pública,
 * redirige a /login. Se ejecuta en cada navegación.
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (PUBLIC_ROUTES.includes(to.path)) return
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
