/**
 * Estado de una sesión activa (en curso).
 * GET /docente/sesiones/:id/estado
 */
export interface SesionCursoEstado {
  id: string
  practica: string
  laboratorio: string
  horaApertura: string // ISO, para el cronómetro
  asistencia: { confirmados: number; total: number }
  incidencias: number
  evidencias: number
}

// ⚠️ MOCK temporal.
export async function fetchSesionCursoMock(id: string): Promise<SesionCursoEstado> {
  await new Promise((r) => setTimeout(r, 250))
  const apertura = new Date(Date.now() - 3 * 60 * 1000 - 15 * 1000)
  return {
    id,
    practica: 'Configuración VLAN',
    laboratorio: 'Lab-B-204',
    horaApertura: apertura.toISOString(),
    asistencia: { confirmados: 18, total: 24 },
    incidencias: 0,
    evidencias: 5,
  }
}
