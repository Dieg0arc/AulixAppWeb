import { useAuthStore } from '~/stores/auth'
import { ROLE_HOME } from '~/lib/constants/roles'
import { loginMock } from './loginMock'

/**
 * Lógica de login: valida credenciales, guarda el usuario en el store
 * y redirige al dashboard según el rol.
 *
 * Cuando el backend exista, sustituir `loginMock(...)` por la llamada real
 * al endpoint POST /auth/login. El resto del flujo no cambia.
 */
export function useLogin() {
  const auth = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      // TODO: reemplazar por POST /auth/login cuando el backend esté listo
      const usuario = await loginMock(email, password)

      auth.setUsuario(usuario)
      await navigateTo(ROLE_HOME[usuario.rol])
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
    } finally {
      loading.value = false
    }
  }

  return { login, loading, error }
}
