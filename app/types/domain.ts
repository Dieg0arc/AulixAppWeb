import type { Role } from '~/lib/constants/roles'

/**
 * Tipos de dominio de Aulix, derivados del Modelo Entidad-Relación.
 * Referencia base mientras el backend expone su contrato OpenAPI.
 * Cuando el codegen del API esté activo, estos tipos se alinearán con él.
 */

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Role
  activo: boolean
}

export interface Laboratorio {
  id: string
  nombre: string
  ubicacion: string
  disponibilidad: boolean
  capacidad: number
  estado: string
  programaId?: string
}

// Auxiliar: estados posibles de un equipo (Equipo.estado como union tipada)
export type EquipoEstado = 'disponible' | 'prestado' | 'reparacion' | 'mantenimiento'

export interface Equipo {
  id: string
  nombre: string
  numeroSerie: string
  tipo: string
  estado: string
  laboratorioId: string
}

export interface Asignatura {
  id: string
  nombre: string
  codigo: string
  programaId: string
}

export interface Reserva {
  id: string
  laboratorioId: string
  docenteId: string
  asignaturaId: string
  fecha: string
  horaInicio: string
  horaFin: string
  estado: string
}

export type SesionEstado = 'abierta' | 'cerrada' | 'incidencia' | 'cancelada'

export interface Sesion {
  id: string
  reservaId: string
  docenteId: string
  horaApertura: string | null
  horaCierre: string | null
  observaciones: string | null
  estado: SesionEstado
}

export type MetodoAsistencia = 'qr' | 'codigo'

export interface Asistencia {
  id: string
  sesionId: string
  estudianteId: string
  horaRegistro: string
  metodo: MetodoAsistencia
  presente: boolean
}

export type IncidenciaEstado = 'abierta' | 'en_proceso' | 'resuelta' | 'cerrada'
export type IncidenciaSeveridad = 'baja' | 'media' | 'alta' | 'critica'

export interface Incidencia {
  id: string
  sesionId: string
  equipoId: string
  reportadoPor: string
  descripcion: string
  severidad: IncidenciaSeveridad
  estado: IncidenciaEstado
  createdAt: string
}

export interface Evidencia {
  id: string
  incidenciaId: string
  urlFoto: string
  descripcion: string
  createdAt: string
}

export type PrestamoEstado = 'activo' | 'devuelto' | 'vencido'

export interface Prestamo {
  id: string
  equipoId: string
  solicitanteId: string
  auxiliarId: string
  sesionId: string | null
  fechaPrestamo: string
  fechaDevolucion: string | null
  estado: PrestamoEstado
}
