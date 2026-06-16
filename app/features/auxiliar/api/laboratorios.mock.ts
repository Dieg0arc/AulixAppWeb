// TODO(backend): GET /api/auxiliar/laboratorios
// Response: LaboratorioAuxiliar[] — labs a cargo del auxiliar autenticado
import type { Laboratorio } from '~/types/domain'

export interface LaboratorioAuxiliar extends Laboratorio {
  programaId: string
  tasaOcupacion: number // 0–100
}

export const LABORATORIOS_MOCK: LaboratorioAuxiliar[] = [
  {
    id: 'lab-b204',
    nombre: 'LAB-B-204',
    ubicacion: 'Bloque B, Piso 2',
    disponibilidad: true,
    capacidad: 30,
    estado: 'activo',
    programaId: 'ing-electronica',
    tasaOcupacion: 72,
  },
  {
    id: 'lab-b205',
    nombre: 'LAB-B-205',
    ubicacion: 'Bloque B, Piso 2',
    disponibilidad: false,
    capacidad: 25,
    estado: 'activo',
    programaId: 'ing-electronica',
    tasaOcupacion: 58,
  },
  {
    id: 'lab-c101',
    nombre: 'LAB-C-101',
    ubicacion: 'Bloque C, Piso 1',
    disponibilidad: true,
    capacidad: 20,
    estado: 'mantenimiento',
    programaId: 'sistemas',
    tasaOcupacion: 34,
  },
]

// TODO(backend): GET /api/auxiliar/laboratorios/:id
// Response: LaboratorioAuxiliar
export function getLaboratorioMock(id: string): LaboratorioAuxiliar | undefined {
  return LABORATORIOS_MOCK.find((l) => l.id === id)
}
