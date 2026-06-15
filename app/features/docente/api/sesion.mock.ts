/**
 * Detalle de una sesión y su flujo (apertura, curso, cierre).
 * Contrato del endpoint GET /docente/sesiones/:id
 */
export type ChecklistEstado = 'ok' | 'opcional' | 'pendiente'

export interface ChecklistItem {
  label: string
  estado: ChecklistEstado
}

export interface SesionDetalle {
  id: string
  practica: string
  asignatura: string
  grupo: string
  laboratorio: string
  ubicacion: string
  capacidad: string // ej "24 puestos · 18 equipos"
  auxiliar: string | null
  descripcionPractica: string
  horaInicio: string // "10:00"
  horaFin: string // "12:00"
  esHoy: boolean
  checklist: ChecklistItem[]
}

// ⚠️ MOCK temporal. Borrar cuando exista el endpoint.
export async function fetchSesionDetalleMock(id: string): Promise<SesionDetalle> {
  await new Promise((r) => setTimeout(r, 300))
  return {
    id,
    practica: 'Configuración VLAN',
    asignatura: 'Programación de Redes',
    grupo: '21A',
    laboratorio: 'Lab-B-204',
    ubicacion: 'Edificio B, P2',
    capacidad: '24 puestos · 18 equipos',
    auxiliar: 'D. Marín',
    descripcionPractica: 'Configuración inicial de VLAN trunk',
    horaInicio: '10:00',
    horaFin: '12:00',
    esHoy: true,
    checklist: [
      { label: 'Equipos disponibles', estado: 'ok' },
      { label: 'Sin incidencias abiertas', estado: 'ok' },
      { label: 'Material de práctica', estado: 'opcional' },
    ],
  }
}
