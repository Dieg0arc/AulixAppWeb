import type { SesionEstado, IncidenciaEstado, IncidenciaSeveridad, PrestamoEstado } from '~/types/domain'

/** Etiquetas legibles de estados de sesión. */
export const SESION_ESTADO_LABEL: Record<SesionEstado, string> = {
  abierta: 'Abierta',
  cerrada: 'Cerrada',
  incidencia: 'Con incidencia',
  cancelada: 'Cancelada',
}

/** Etiquetas de estados de incidencia. */
export const INCIDENCIA_ESTADO_LABEL: Record<IncidenciaEstado, string> = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
}

/** Severidad de incidencia → token de color (ver tailwind.config.ts). */
export const SEVERIDAD_COLOR: Record<IncidenciaSeveridad, string> = {
  baja: 'ok',
  media: 'warn',
  alta: 'cobre',
  critica: 'danger',
}

/** Etiquetas de estados de préstamo. */
export const PRESTAMO_ESTADO_LABEL: Record<PrestamoEstado, string> = {
  activo: 'Activo',
  devuelto: 'Devuelto',
  vencido: 'Vencido',
}
