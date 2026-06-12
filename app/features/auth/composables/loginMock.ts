import type { Usuario } from '~/types/domain'
import { ROLES } from '~/lib/constants/roles'

/**
 * ⚠️ MOCK TEMPORAL — NO ES AUTENTICACIÓN REAL ⚠️
 *
 * Simula la respuesta del backend mientras la API de FastAPI no existe.
 * Validar contraseñas en el frontend NO es seguro: cualquiera ve este código.
 *
 * TODO: ELIMINAR este archivo cuando el backend esté listo.
 * Reemplazar la llamada en useLogin.ts por: POST /auth/login → { usuario }
 *
 * Cuentas demo del diseño (contraseña: pass123).
 */
const DEMO_PASSWORD = 'pass123'

const DEMO_USERS: Record<string, Usuario> = {
  'c.gomez@cue.edu.co': {
    id: 'demo-docente',
    nombre: 'Carolina Gómez',
    email: 'c.gomez@cue.edu.co',
    rol: ROLES.DOCENTE,
    activo: true,
  },
  'estudiante@cue.edu.co': {
    id: 'demo-estudiante',
    nombre: 'Estudiante Demo',
    email: 'estudiante@cue.edu.co',
    rol: ROLES.ESTUDIANTE,
    activo: true,
  },
  'auxiliar@cue.edu.co': {
    id: 'demo-auxiliar',
    nombre: 'Auxiliar Demo',
    email: 'auxiliar@cue.edu.co',
    rol: ROLES.AUXILIAR,
    activo: true,
  },
  'soporte@cue.edu.co': {
    id: 'demo-soporte',
    nombre: 'Soporte Demo',
    email: 'soporte@cue.edu.co',
    rol: ROLES.SOPORTE,
    activo: true,
  },
}

/** Simula latencia de red y devuelve el usuario, o lanza error si las credenciales no coinciden. */
export async function loginMock(email: string, password: string): Promise<Usuario> {
  await new Promise((resolve) => setTimeout(resolve, 600)) // simula la red

  const user = DEMO_USERS[email.toLowerCase()]
  if (!user || password !== DEMO_PASSWORD) {
    throw new Error('Correo o contraseña incorrectos')
  }
  return user
}
