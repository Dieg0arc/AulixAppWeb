// TODO(backend): GET /api/estudiante/asignaturas
// Response: AsignaturaMatriculada[]  (asignaturas en las que el estudiante está inscrito este semestre)

/** Vista desnormalizada de la matrícula del estudiante. */
export interface AsignaturaMatriculada {
  id: string
  asignaturaId: string
  codigo: string   // 'PROG-301'
  nombre: string   // 'Programación de Redes'
  grupo: string    // '21A'
  proximaSesion?: {
    fecha: string      // 'YYYY-MM-DD'
    horaInicio: string // 'HH:mm'
    horaFin: string
    laboratorio: string
  }
}

const HOY = new Date().toISOString().slice(0, 10)

export const ASIGNATURAS_MOCK: AsignaturaMatriculada[] = [
  {
    id: 'mat-001',
    asignaturaId: 'asig-prog-redes',
    codigo: 'PROG-301',
    nombre: 'Programación de Redes',
    grupo: '21A',
    proximaSesion: { fecha: HOY, horaInicio: '10:00', horaFin: '12:00', laboratorio: 'Lab-B-204' },
  },
  {
    id: 'mat-002',
    asignaturaId: 'asig-elec-dig',
    codigo: 'ELEC-202',
    nombre: 'Electrónica Digital',
    grupo: '20B',
    proximaSesion: { fecha: '2026-06-19', horaInicio: '08:00', horaFin: '10:00', laboratorio: 'Lab-B-201' },
  },
  {
    id: 'mat-003',
    asignaturaId: 'asig-micro',
    codigo: 'MICR-305',
    nombre: 'Microprocesadores',
    grupo: '21C',
    proximaSesion: { fecha: '2026-06-20', horaInicio: '14:00', horaFin: '16:00', laboratorio: 'Lab-B-203' },
  },
  {
    id: 'mat-004',
    asignaturaId: 'asig-sist-op',
    codigo: 'SIST-401',
    nombre: 'Sistemas Operativos',
    grupo: '22A',
    // sin sesión programada esta semana
  },
]

// TODO(backend): reemplazar por $fetch('/estudiante/asignaturas')
export async function fetchAsignaturasMock(): Promise<AsignaturaMatriculada[]> {
  await new Promise((r) => setTimeout(r, 300))
  return ASIGNATURAS_MOCK
}
