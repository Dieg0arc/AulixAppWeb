// TODO(backend): GET /api/auxiliar/prestamos?estado=activo
// Response: PrestamoDetalle[] — préstamos con info expandida de equipo y solicitante
import type { Prestamo, PrestamoEstado } from '~/types/domain'

export interface UsuarioResumen {
  id: string
  nombre: string
  programa: string
  avatarIniciales: string
}

export interface PrestamoDetalle extends Prestamo {
  equipo: {
    nombre: string
    numeroSerie: string
    tipo: string
  }
  solicitante: UsuarioResumen
}

// Usuarios solicitantes demo (distintos del auxiliar autenticado)
export const SOLICITANTES_MOCK: UsuarioResumen[] = [
  { id: 'usr-lp01', nombre: 'Laura Pérez', programa: 'Ing. Electrónica', avatarIniciales: 'LP' },
  { id: 'usr-cm02', nombre: 'Carlos Mora', programa: 'Ing. Sistemas', avatarIniciales: 'CM' },
  { id: 'usr-ar03', nombre: 'Ana Ríos', programa: 'Ing. Electrónica', avatarIniciales: 'AR' },
  { id: 'usr-jv04', nombre: 'Jorge Vargas', programa: 'Ing. Civil', avatarIniciales: 'JV' },
  { id: 'usr-ms05', nombre: 'María Silva', programa: 'Ing. Sistemas', avatarIniciales: 'MS' },
]

// auxiliarId del mock = el usuario auxiliar autenticado (aux-001 = Diego Marín)
export const PRESTAMOS_MOCK: PrestamoDetalle[] = [
  {
    id: 'prs-001',
    equipoId: 'eq-003',
    solicitanteId: 'usr-lp01',
    auxiliarId: 'aux-001',
    sesionId: 'ses-abc',
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // hace 45 min
    fechaDevolucion: new Date(Date.now() + 1000 * 60 * 75).toISOString(), // vence en 75 min
    estado: 'activo',
    equipo: { nombre: 'Fuente DC Variable', numeroSerie: 'FDC-2022-012', tipo: 'Alimentación' },
    solicitante: SOLICITANTES_MOCK[0]!,
  },
  {
    id: 'prs-002',
    equipoId: 'eq-009',
    solicitanteId: 'usr-cm02',
    auxiliarId: 'aux-001',
    sesionId: null,
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // hace 90 min
    fechaDevolucion: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // vence en 30 min
    estado: 'activo',
    equipo: { nombre: 'Kit Arduino Uno', numeroSerie: 'ARD-2023-034', tipo: 'Microcontrolador' },
    solicitante: SOLICITANTES_MOCK[1]!,
  },
  {
    id: 'prs-003',
    equipoId: 'eq-001',
    solicitanteId: 'usr-ar03',
    auxiliarId: 'aux-001',
    sesionId: 'ses-xyz',
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    fechaDevolucion: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    estado: 'devuelto',
    equipo: { nombre: 'Osciloscopio Digital', numeroSerie: 'OSC-2024-001', tipo: 'Medición' },
    solicitante: SOLICITANTES_MOCK[2]!,
  },
  {
    id: 'prs-004',
    equipoId: 'eq-004',
    solicitanteId: 'usr-jv04',
    auxiliarId: 'aux-001',
    sesionId: null,
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    fechaDevolucion: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    estado: 'vencido',
    equipo: { nombre: 'Generador de Funciones', numeroSerie: 'GFN-2024-007', tipo: 'Señales' },
    solicitante: SOLICITANTES_MOCK[3]!,
  },
  {
    id: 'prs-005',
    equipoId: 'eq-006',
    solicitanteId: 'usr-ms05',
    auxiliarId: 'aux-001',
    sesionId: 'ses-def',
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    fechaDevolucion: new Date(Date.now() + 1000 * 60 * 100).toISOString(),
    estado: 'activo',
    equipo: { nombre: 'Soldador de Estaño', numeroSerie: 'SOL-2023-088', tipo: 'Herramienta' },
    solicitante: SOLICITANTES_MOCK[4]!,
  },
]

// TODO(backend): GET /api/auxiliar/prestamos?estado=activo
export function getPrestamosMock(estado?: PrestamoEstado): PrestamoDetalle[] {
  if (!estado) return PRESTAMOS_MOCK
  return PRESTAMOS_MOCK.filter((p) => p.estado === estado)
}

// TODO(backend): GET /api/auxiliar/prestamos/:id
export function getPrestamoPorIdMock(id: string): PrestamoDetalle | undefined {
  return PRESTAMOS_MOCK.find((p) => p.id === id)
}

// TODO(backend): POST /api/auxiliar/prestamos
// Body: { equipoId, solicitanteId, fechaDevolucion, observaciones? }
// Response: PrestamoDetalle creado
export async function registrarPrestamoMock(payload: {
  equipoId: string
  solicitanteId: string
  fechaDevolucion: string
  observaciones?: string
}): Promise<PrestamoDetalle> {
  await new Promise((r) => setTimeout(r, 700))
  const equipo = { nombre: 'Equipo seleccionado', numeroSerie: 'EQ-MOCK', tipo: 'General' }
  const solicitante = SOLICITANTES_MOCK.find((s) => s.id === payload.solicitanteId) ?? SOLICITANTES_MOCK[0]!
  return {
    id: `prs-${Date.now()}`,
    equipoId: payload.equipoId,
    solicitanteId: payload.solicitanteId,
    auxiliarId: 'aux-001',
    sesionId: null,
    fechaPrestamo: new Date().toISOString(),
    fechaDevolucion: payload.fechaDevolucion,
    estado: 'activo',
    equipo,
    solicitante,
  }
}

// TODO(backend): PATCH /api/auxiliar/prestamos/:id/devolver
// Body: { estadoEquipo: 'buen_estado'|'con_danos'|'requiere_mantenimiento', observaciones? }
// Response: PrestamoDetalle actualizado con estado='devuelto'
export async function devolverPrestamoMock(
  id: string,
  estadoEquipo: 'buen_estado' | 'con_danos' | 'requiere_mantenimiento',
  observaciones?: string,
): Promise<PrestamoDetalle> {
  await new Promise((r) => setTimeout(r, 700))
  const prestamo = PRESTAMOS_MOCK.find((p) => p.id === id)
  if (!prestamo) throw new Error('Préstamo no encontrado')
  return { ...prestamo, estado: 'devuelto', fechaDevolucion: new Date().toISOString() }
}
