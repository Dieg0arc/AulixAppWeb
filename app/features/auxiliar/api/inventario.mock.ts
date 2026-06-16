// TODO(backend): GET /api/auxiliar/inventario?rango=semana|mes|semestre&laboratorioId=
// Response: InventarioMetricas
import { EQUIPOS_MOCK } from './equipos.mock'
import { LABORATORIOS_MOCK } from './laboratorios.mock'

export type RangoInventario = 'semana' | 'mes' | 'semestre'

export interface OcupacionLab {
  laboratorioId: string
  nombre: string
  porcentaje: number
}

export interface InventarioMetricas {
  disponibilidadPct: number
  sesionPromedioMin: number
  ocupacionPorLab: OcupacionLab[]
  prestadosAhora: number
  tasaRetornoPct: number
  prestamoPromedioMin: number
  enReparacion: number
}

// TODO(backend): GET /api/auxiliar/inventario/metricas?rango=semana
export function getInventarioMetricasMock(_rango: RangoInventario = 'semana'): InventarioMetricas {
  const total = EQUIPOS_MOCK.length
  const disponibles = EQUIPOS_MOCK.filter((e) => e.estado === 'disponible').length
  const prestados = EQUIPOS_MOCK.filter((e) => e.estado === 'prestado').length
  const enReparacion = EQUIPOS_MOCK.filter((e) => e.estado === 'reparacion').length

  // Variar datos según el rango para dar sensación de dinamismo al cambiar el chip
  const factores: Record<RangoInventario, { sesionMin: number; retornoPct: number; prestamoMin: number }> = {
    semana: { sesionMin: 95, retornoPct: 94, prestamoMin: 87 },
    mes: { sesionMin: 102, retornoPct: 91, prestamoMin: 95 },
    semestre: { sesionMin: 88, retornoPct: 96, prestamoMin: 78 },
  }
  const f = factores[_rango]

  return {
    disponibilidadPct: Math.round((disponibles / total) * 100),
    sesionPromedioMin: f.sesionMin,
    ocupacionPorLab: LABORATORIOS_MOCK.map((lab) => ({
      laboratorioId: lab.id,
      nombre: lab.nombre,
      porcentaje: lab.tasaOcupacion,
    })),
    prestadosAhora: prestados,
    tasaRetornoPct: f.retornoPct,
    prestamoPromedioMin: f.prestamoMin,
    enReparacion,
  }
}
