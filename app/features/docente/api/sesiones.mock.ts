import type { SesionEstado } from '~/types/domain'

/**
 * Vista desnormalizada de una sesión para las pantallas del docente.
 * NO es la entidad Sesion del dominio (esa es solo IDs). El backend
 * entregará la sesión con sus datos ya resueltos (asignatura, lab, grupo).
 * Este es el contrato que el endpoint GET /docente/mi-dia debe respetar.
 */
export interface SesionResumen {
  id: string
  reservaId: string
  practica: string
  asignatura: string
  grupo: string
  laboratorio: string
  estudiantesEsperados: number
  horaInicio: string // 'HH:mm'
  horaFin: string
  estado: SesionEstado | 'programada'
}

// ⚠️ MOCK temporal. Borrar cuando exista el endpoint del backend.
// Reemplazar la llamada en el composable por GET /docente/mi-dia.
export async function fetchMiDiaMock(): Promise<SesionResumen[]> {
  await new Promise((r) => setTimeout(r, 300)) // simula latencia de red
  return [
    {
      id: 'ses-001',
      reservaId: 'res-001',
      practica: 'Configuración VLAN',
      asignatura: 'Programación de Redes',
      grupo: '21A',
      laboratorio: 'Lab-B-204',
      estudiantesEsperados: 24,
      horaInicio: '10:00',
      horaFin: '12:00',
      estado: 'programada',
    },
  ]
}
