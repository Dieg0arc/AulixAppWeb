// Mapeo estado → tono para EstadoBadge, LOCAL a features/auxiliar/.
// No modifica EstadoBadge (zona congelada).
import type { EquipoEstado } from '~/types/domain'
import type { PrestamoEstado } from '~/types/domain'

type Tono = 'ok' | 'info' | 'warn' | 'danger' | 'neutral'

export function tonoEquipo(estado: EquipoEstado): Tono {
  const mapa: Record<EquipoEstado, Tono> = {
    disponible: 'ok',
    prestado: 'warn',
    reparacion: 'danger',
    mantenimiento: 'neutral',
  }
  return mapa[estado]
}

export function tonoPrestamo(estado: PrestamoEstado): Tono {
  const mapa: Record<PrestamoEstado, Tono> = {
    activo: 'warn',
    devuelto: 'ok',
    vencido: 'danger',
  }
  return mapa[estado]
}
