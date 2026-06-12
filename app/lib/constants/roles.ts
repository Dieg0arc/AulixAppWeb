/**
 * Roles del sistema Aulix.
 * El login es único: el backend detecta el rol por credenciales
 * y el frontend redirige al dashboard correspondiente.
 */
export const ROLES = {
  DOCENTE: 'docente',
  ESTUDIANTE: 'estudiante',
  AUXILIAR: 'auxiliar',
  SOPORTE: 'soporte',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/** Ruta base de cada rol — usada en la redirección post-login y en la navegación. */
export const ROLE_HOME: Record<Role, string> = {
  docente: '/docente',
  estudiante: '/estudiante',
  auxiliar: '/auxiliar',
  soporte: '/soporte',
}

/** Color de cada rol (debe coincidir con tailwind.config.ts → colors.rol). */
export const ROLE_COLOR: Record<Role, string> = {
  docente: '#2C5BA8',
  estudiante: '#0891B2',
  auxiliar: '#059669',
  soporte: '#B36A2E',
}

/** Etiqueta legible de cada rol para la UI. */
export const ROLE_LABEL: Record<Role, string> = {
  docente: 'Docente',
  estudiante: 'Estudiante',
  auxiliar: 'Auxiliar',
  soporte: 'Soporte técnico',
}
