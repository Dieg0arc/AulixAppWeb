// TODO(backend): GET /api/estudiante/historial
// Response: AsistenciaHistorial[]  (asistencias registradas del estudiante, más reciente primero)
import type { MetodoAsistencia } from '~/types/domain'

export interface AsistenciaHistorial {
  id: string
  sesionId: string
  fecha: string  // 'YYYY-MM-DD'
  hora: string   // 'HH:mm'
  practica: string
  asignatura: string
  codigo: string // código de asignatura
  laboratorio: string
  metodo: MetodoAsistencia
  presente: boolean
}

export const HISTORIAL_MOCK: AsistenciaHistorial[] = [
  {
    id: 'ast-h-001',
    sesionId: 'ses-099',
    fecha: '2026-06-10',
    hora: '10:03',
    practica: 'Subredes IPv4',
    asignatura: 'Programación de Redes',
    codigo: 'PROG-301',
    laboratorio: 'Lab-B-204',
    metodo: 'qr',
    presente: true,
  },
  {
    id: 'ast-h-002',
    sesionId: 'ses-098',
    fecha: '2026-06-05',
    hora: '08:07',
    practica: 'Compuertas lógicas',
    asignatura: 'Electrónica Digital',
    codigo: 'ELEC-202',
    laboratorio: 'Lab-B-201',
    metodo: 'codigo',
    presente: true,
  },
  {
    id: 'ast-h-003',
    sesionId: 'ses-097',
    fecha: '2026-06-03',
    hora: '10:01',
    practica: 'Enrutamiento estático',
    asignatura: 'Programación de Redes',
    codigo: 'PROG-301',
    laboratorio: 'Lab-B-204',
    metodo: 'qr',
    presente: true,
  },
  {
    id: 'ast-h-004',
    sesionId: 'ses-096',
    fecha: '2026-05-29',
    hora: '14:04',
    practica: 'Interrupciones',
    asignatura: 'Microprocesadores',
    codigo: 'MICR-305',
    laboratorio: 'Lab-B-203',
    metodo: 'codigo',
    presente: true,
  },
  {
    id: 'ast-h-005',
    sesionId: 'ses-095',
    fecha: '2026-05-22',
    hora: '08:02',
    practica: 'Flip-flops',
    asignatura: 'Electrónica Digital',
    codigo: 'ELEC-202',
    laboratorio: 'Lab-B-201',
    metodo: 'qr',
    presente: true,
  },
]

// TODO(backend): reemplazar por $fetch('/estudiante/historial')
export async function fetchHistorialMock(): Promise<AsistenciaHistorial[]> {
  await new Promise((r) => setTimeout(r, 300))
  return HISTORIAL_MOCK
}
