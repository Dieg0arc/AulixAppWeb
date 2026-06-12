import { useAuthStore } from '~/stores/auth'
import { ROLE_HOME, type Role } from '~/lib/constants/roles'

/**
 * Verifica que el rol del usuario coincide con el permitido por la ruta.
 * Si un estudiante intenta entrar a /docente/..., lo rebota a su propio home.
 *
 * IMPORTANTE: esto es UX y defensa en profundidad, NO seguridad.
 * La autorización real la impone el backend en cada endpoint.
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const allowed = to.meta.allowedRole as Role | undefined

  if (!allowed) return
  if (auth.rol !== allowed) {
    return navigateTo(auth.rol ? ROLE_HOME[auth.rol] : '/login')
  }
})
