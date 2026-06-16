/**
 * Resumen para cerrar una sesión.
 * GET /docente/sesiones/:id/resumen-cierre
 */
export type EstadoFinal = 'normal' | 'incidencia' | 'cancelada'

export interface ResumenCierre {
  id: string
  horaApertura: string // "10:03"
  horaFin: string // "12:00"
  horaAperturaIso: string // para calcular duración
  asistencia: { confirmados: number; total: number }
  incidencias: number
  evidencias: number
}

// ⚠️ MOCK temporal.
export async function fetchResumenCierreMock(id: string): Promise<ResumenCierre> {
  await new Promise((r) => setTimeout(r, 250))
  const apertura = new Date(Date.now() - (1 * 3600 + 57 * 60 + 20) * 1000)
  return {
    id,
    horaApertura: '10:03',
    horaFin: '12:00',
    horaAperturaIso: apertura.toISOString(),
    asistencia: { confirmados: 22, total: 24 },
    incidencias: 1,
    evidencias: 5,
  }
}
