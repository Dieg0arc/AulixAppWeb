/**
 * Catálogo y envío de incidencias.
 * GET /docente/sesiones/:id/contexto-incidencia  → equipos disponibles
 * POST /docente/incidencias                        → crea la incidencia
 */
export type TipoIncidencia = 'equipo' | 'seguridad' | 'infraestructura' | 'otra'

export interface EquipoRef {
  id: string
  nombre: string
  serie: string
  numero: string
}

export interface ContextoIncidencia {
  sesionRef: string // "RF-09"
  laboratorio: string
  equipos: EquipoRef[]
}

export interface NuevaIncidencia {
  tipo: TipoIncidencia
  equipoId: string | null
  descripcion: string
  // las fotos se suben aparte; aquí solo el conteo para el mock
  evidencias: number
}

// ⚠️ MOCK temporal.
export async function fetchContextoIncidenciaMock(id: string): Promise<ContextoIncidencia> {
  await new Promise((r) => setTimeout(r, 250))
  void id
  return {
    sesionRef: 'RF-09',
    laboratorio: 'Lab-B-204',
    equipos: [
      { id: 'eq-03', nombre: 'Switch Cisco 03', serie: 'CIS-2960-X', numero: '03' },
      { id: 'eq-04', nombre: 'Switch Cisco 04', serie: 'CIS-2960-X', numero: '04' },
      { id: 'eq-pc12', nombre: 'PC Banco A-12', serie: 'HP-EliteDesk', numero: '12' },
    ],
  }
}

export async function enviarIncidenciaMock(payload: NuevaIncidencia): Promise<{ ok: true; id: string }> {
  await new Promise((r) => setTimeout(r, 600))
  void payload
  return { ok: true, id: 'INC-' + Math.floor(Math.random() * 9000 + 1000) }
}
