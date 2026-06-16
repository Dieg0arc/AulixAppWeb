/**
 * Galería de evidencias de una sesión.
 * GET /docente/sesiones/:id/evidencias
 */
export type TipoEvidencia = 'foto' | 'nota_voz'

export interface Evidencia {
  id: string
  titulo: string
  hora: string // "10:12"
  tipo: TipoEvidencia
  adjuntaA: string | null // ticket de incidencia, ej "#2847"
}

export interface GaleriaEvidencias {
  laboratorio: string
  fecha: string // "22 MAY"
  items: Evidencia[]
}

// ⚠️ MOCK temporal.
export async function fetchEvidenciasMock(id: string): Promise<GaleriaEvidencias> {
  await new Promise((r) => setTimeout(r, 250))
  void id
  return {
    laboratorio: 'Lab-B-204',
    fecha: '22 MAY',
    items: [
      { id: 'ev-1', titulo: 'Banco A · puestos', hora: '10:12', tipo: 'foto', adjuntaA: null },
      { id: 'ev-2', titulo: 'Falla switch 03', hora: '10:21', tipo: 'foto', adjuntaA: '#2847' },
      { id: 'ev-3', titulo: 'Configuración trunk', hora: '10:34', tipo: 'foto', adjuntaA: null },
      { id: 'ev-4', titulo: 'Cableado rack', hora: '10:48', tipo: 'foto', adjuntaA: null },
    ],
  }
}
