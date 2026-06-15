/**
 * Vista de una entrada de agenda del docente.
 * Contrato del endpoint GET /docente/agenda?desde=&hasta=
 * El backend entrega las sesiones de la semana ya desnormalizadas.
 */
export type EntradaEstado = 'en_curso' | 'programada' | 'completada' | 'cancelada'

export interface EntradaAgenda {
  id: string
  fecha: string // 'YYYY-MM-DD'
  horaInicio: string // 'HH:mm'
  duracion: string // ej '2h', '1.5h'
  titulo: string
  laboratorio: string
  grupo: string | null // null para tutorías/asesorías
  estado: EntradaEstado
}

// ⚠️ MOCK temporal. Borrar cuando exista el endpoint.
// Reemplazar por $fetch('/docente/agenda', { query: { desde, hasta } }).
export async function fetchAgendaMock(): Promise<EntradaAgenda[]> {
  await new Promise((r) => setTimeout(r, 300))
  return [
    {
      id: 'ag-001',
      fecha: '2026-05-22',
      horaInicio: '10:00',
      duracion: '2h',
      titulo: 'Configuración VLAN',
      laboratorio: 'Lab-B-204',
      grupo: '21A',
      estado: 'en_curso',
    },
    {
      id: 'ag-002',
      fecha: '2026-05-22',
      horaInicio: '14:00',
      duracion: '1.5h',
      titulo: 'Asesoría individual',
      laboratorio: 'Lab-B-204',
      grupo: null,
      estado: 'programada',
    },
    {
      id: 'ag-003',
      fecha: '2026-05-22',
      horaInicio: '16:00',
      duracion: '2h',
      titulo: 'Big Data — Práctica 3',
      laboratorio: 'Lab-C-305',
      grupo: '22B',
      estado: 'programada',
    },
    {
      id: 'ag-004',
      fecha: '2026-05-23',
      horaInicio: '08:00',
      duracion: '2h',
      titulo: 'Bases de Datos II',
      laboratorio: 'Lab-A-102',
      grupo: '21A',
      estado: 'programada',
    },
    {
      id: 'ag-005',
      fecha: '2026-05-23',
      horaInicio: '11:00',
      duracion: '1h',
      titulo: 'Revisión de proyectos',
      laboratorio: 'Lab-B-204',
      grupo: '22A',
      estado: 'programada',
    },
  ]
}
