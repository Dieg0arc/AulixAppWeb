/**
 * Vista de indicadores del docente.
 * Contrato del endpoint GET /docente/indicadores?periodo=semana|mes|semestre
 */
export type Periodo = 'semana' | 'mes' | 'semestre'

export interface ResumenIndicadores {
  asistenciaPromedio: number // 0-100
  deltaAsistencia: number // vs periodo anterior, puede ser negativo
  sesionesDictadas: number
  inasistenciasCriticas: number
}

export interface AsistenciaAsignatura {
  asignatura: string
  porcentaje: number // 0-100
}

export interface EstadoReservas {
  completadas: number // %
  pendientes: number // %
  canceladas: number // %
}

export interface InasistenciaCritica {
  estudiante: string
  faltas: number
}

export interface IndicadoresDocente {
  resumen: ResumenIndicadores
  asistenciaPorAsignatura: AsistenciaAsignatura[]
  estadoReservas: EstadoReservas
  inasistenciasCriticas: InasistenciaCritica[]
}

// ⚠️ MOCK temporal. Borrar cuando exista el endpoint.
export async function fetchIndicadoresMock(periodo: Periodo): Promise<IndicadoresDocente> {
  await new Promise((r) => setTimeout(r, 300))
  // El mock ignora el periodo (devuelve siempre lo mismo); el backend sí filtrará.
  void periodo
  return {
    resumen: {
      asistenciaPromedio: 88,
      deltaAsistencia: 3,
      sesionesDictadas: 24,
      inasistenciasCriticas: 3,
    },
    asistenciaPorAsignatura: [
      { asignatura: 'Redes y Telecom.', porcentaje: 91 },
      { asignatura: 'Bases de Datos II', porcentaje: 84 },
      { asignatura: 'Programación Móvil', porcentaje: 78 },
      { asignatura: 'Arquitectura', porcentaje: 69 },
    ],
    estadoReservas: { completadas: 64, pendientes: 24, canceladas: 12 },
    inasistenciasCriticas: [
      { estudiante: 'Luis Ramírez', faltas: 4 },
      { estudiante: 'Ana Torres', faltas: 3 },
      { estudiante: 'Jorge Mora', faltas: 3 },
    ],
  }
}
