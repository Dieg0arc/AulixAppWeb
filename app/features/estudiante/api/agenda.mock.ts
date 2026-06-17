// TODO(backend): GET /api/estudiante/agenda?desde=&hasta=
// Response: AgendaSesion[]  (prácticas programadas dentro del rango de fechas)

export interface AgendaSesion {
  id: string
  fecha: string      // 'YYYY-MM-DD'
  horaInicio: string // 'HH:mm'
  horaFin: string
  practica: string
  asignatura: string
  codigo: string     // código de asignatura
  grupo: string
  laboratorio: string
}

const HOY = new Date().toISOString().slice(0, 10)

export const AGENDA_MOCK: AgendaSesion[] = [
  {
    id: 'agen-001',
    fecha: HOY,
    horaInicio: '10:00',
    horaFin: '12:00',
    practica: 'Configuración VLAN',
    asignatura: 'Programación de Redes',
    codigo: 'PROG-301',
    grupo: '21A',
    laboratorio: 'Lab-B-204',
  },
  {
    id: 'agen-002',
    fecha: '2026-06-19',
    horaInicio: '08:00',
    horaFin: '10:00',
    practica: 'Circuitos combinacionales',
    asignatura: 'Electrónica Digital',
    codigo: 'ELEC-202',
    grupo: '20B',
    laboratorio: 'Lab-B-201',
  },
  {
    id: 'agen-003',
    fecha: '2026-06-20',
    horaInicio: '14:00',
    horaFin: '16:00',
    practica: 'Programación en ensamblador',
    asignatura: 'Microprocesadores',
    codigo: 'MICR-305',
    grupo: '21C',
    laboratorio: 'Lab-B-203',
  },
]

// TODO(backend): reemplazar por $fetch('/estudiante/agenda')
export async function fetchAgendaMock(): Promise<AgendaSesion[]> {
  await new Promise((r) => setTimeout(r, 300))
  return AGENDA_MOCK
}
