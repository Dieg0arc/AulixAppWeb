// TODO(backend): GET /api/auxiliar/equipos?laboratorioId=&estado=
// Response: Equipo[] con EquipoEstado tipado
import type { Equipo } from '~/types/domain'
import type { EquipoEstado } from '~/types/domain'

export interface EquipoConEstado extends Omit<Equipo, 'estado'> {
  estado: EquipoEstado
}

export const EQUIPOS_MOCK: EquipoConEstado[] = [
  {
    id: 'eq-001',
    nombre: 'Osciloscopio Digital',
    numeroSerie: 'OSC-2024-001',
    tipo: 'Medición',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-002',
    nombre: 'Multímetro Fluke',
    numeroSerie: 'FLK-2023-045',
    tipo: 'Medición',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-003',
    nombre: 'Fuente DC Variable',
    numeroSerie: 'FDC-2022-012',
    tipo: 'Alimentación',
    estado: 'prestado',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-004',
    nombre: 'Generador de Funciones',
    numeroSerie: 'GFN-2024-007',
    tipo: 'Señales',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-005',
    nombre: 'Analizador de Espectro',
    numeroSerie: 'AES-2021-003',
    tipo: 'Análisis',
    estado: 'reparacion',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-006',
    nombre: 'Soldador de Estaño',
    numeroSerie: 'SOL-2023-088',
    tipo: 'Herramienta',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-007',
    nombre: 'Microscopio USB',
    numeroSerie: 'MIC-2024-002',
    tipo: 'Observación',
    estado: 'mantenimiento',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-008',
    nombre: 'Protoboard 830 puntos',
    numeroSerie: 'PBD-2024-021',
    tipo: 'Componente',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-009',
    nombre: 'Kit Arduino Uno',
    numeroSerie: 'ARD-2023-034',
    tipo: 'Microcontrolador',
    estado: 'prestado',
    laboratorioId: 'lab-b204',
  },
  {
    id: 'eq-010',
    nombre: 'Pistola de Calor',
    numeroSerie: 'PCL-2022-005',
    tipo: 'Herramienta',
    estado: 'disponible',
    laboratorioId: 'lab-b204',
  },
]

// TODO(backend): GET /api/auxiliar/equipos/buscar?q=&laboratorioId=
// Response: EquipoConEstado[] filtrado por nombre o numeroSerie
export function buscarEquiposMock(query: string): EquipoConEstado[] {
  const q = query.toLowerCase().trim()
  if (!q) return EQUIPOS_MOCK
  return EQUIPOS_MOCK.filter(
    (e) =>
      e.nombre.toLowerCase().includes(q) ||
      e.numeroSerie.toLowerCase().includes(q) ||
      e.tipo.toLowerCase().includes(q),
  )
}

// TODO(backend): GET /api/auxiliar/equipos/stats
// Response: { disponibles: number, prestados: number, reparacion: number, mantenimiento: number }
export function getEquipoStatsMock() {
  return {
    disponibles: EQUIPOS_MOCK.filter((e) => e.estado === 'disponible').length,
    prestados: EQUIPOS_MOCK.filter((e) => e.estado === 'prestado').length,
    reparacion: EQUIPOS_MOCK.filter((e) => e.estado === 'reparacion').length,
    mantenimiento: EQUIPOS_MOCK.filter((e) => e.estado === 'mantenimiento').length,
  }
}
