// TODO(backend): GET /api/auxiliar/historial?desde=&hasta=&estado=
// Response: HistorialDia[] — préstamos agrupados por día para el historial
import type { PrestamoEstado } from '~/types/domain'
import type { PrestamoDetalle } from './prestamos.mock'
import { PRESTAMOS_MOCK, SOLICITANTES_MOCK } from './prestamos.mock'

export interface EntradaHistorial extends PrestamoDetalle {
  duracionMinutos: number
}

export interface HistorialDia {
  fecha: string        // ISO date "YYYY-MM-DD"
  etiqueta: string     // "HOY · LUN 16 JUN" / "JUE 22 MAY"
  prestamos: EntradaHistorial[]
}

function labelFecha(fechaISO: string): string {
  const d = new Date(fechaISO)
  const hoy = new Date()
  const ayer = new Date(hoy); ayer.setDate(hoy.getDate() - 1)
  const esHoy = d.toDateString() === hoy.toDateString()
  const esAyer = d.toDateString() === ayer.toDateString()
  const fmt = d
    .toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit', month: 'short' })
    .toUpperCase()
    .replace(/\./g, '')
  if (esHoy) return `HOY · ${fmt}`
  if (esAyer) return `AYER · ${fmt}`
  return fmt
}

// Historial extendido con entradas pasadas para dar más volumen
const HISTORIAL_EXTRA: EntradaHistorial[] = [
  {
    id: 'prs-h01',
    equipoId: 'eq-002',
    solicitanteId: 'usr-ar03',
    auxiliarId: 'aux-001',
    sesionId: null,
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    fechaDevolucion: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    estado: 'devuelto',
    equipo: { nombre: 'Multímetro Fluke', numeroSerie: 'FLK-2023-045', tipo: 'Medición' },
    solicitante: SOLICITANTES_MOCK[2]!,
    duracionMinutos: 120,
  },
  {
    id: 'prs-h02',
    equipoId: 'eq-008',
    solicitanteId: 'usr-jv04',
    auxiliarId: 'aux-001',
    sesionId: 'ses-past',
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    fechaDevolucion: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    estado: 'devuelto',
    equipo: { nombre: 'Protoboard 830 puntos', numeroSerie: 'PBD-2024-021', tipo: 'Componente' },
    solicitante: SOLICITANTES_MOCK[3]!,
    duracionMinutos: 60,
  },
  {
    id: 'prs-h03',
    equipoId: 'eq-010',
    solicitanteId: 'usr-ms05',
    auxiliarId: 'aux-001',
    sesionId: null,
    fechaPrestamo: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    fechaDevolucion: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    estado: 'devuelto',
    equipo: { nombre: 'Pistola de Calor', numeroSerie: 'PCL-2022-005', tipo: 'Herramienta' },
    solicitante: SOLICITANTES_MOCK[4]!,
    duracionMinutos: 180,
  },
]

function toEntrada(p: PrestamoDetalle): EntradaHistorial {
  const inicio = new Date(p.fechaPrestamo).getTime()
  const fin = p.fechaDevolucion ? new Date(p.fechaDevolucion).getTime() : Date.now()
  return { ...p, duracionMinutos: Math.round((fin - inicio) / 60000) }
}

// TODO(backend): GET /api/auxiliar/historial → devuelve array flat; el frontend agrupa
export function getHistorialMock(filtroEstado?: PrestamoEstado): HistorialDia[] {
  const todasLasEntradas: EntradaHistorial[] = [
    ...PRESTAMOS_MOCK.map(toEntrada),
    ...HISTORIAL_EXTRA,
  ]

  const filtradas = filtroEstado
    ? todasLasEntradas.filter((e) => e.estado === filtroEstado)
    : todasLasEntradas

  // Agrupar por fecha ISO
  const grupos = new Map<string, EntradaHistorial[]>()
  for (const entrada of filtradas) {
    const fechaKey = entrada.fechaPrestamo.split('T')[0]!
    if (!grupos.has(fechaKey)) grupos.set(fechaKey, [])
    grupos.get(fechaKey)!.push(entrada)
  }

  return Array.from(grupos.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([fecha, prestamos]) => ({
      fecha,
      etiqueta: labelFecha(fecha),
      prestamos: prestamos.sort(
        (a, b) =>
          new Date(b.fechaPrestamo).getTime() - new Date(a.fechaPrestamo).getTime(),
      ),
    }))
}

// TODO(backend): GET /api/auxiliar/historial/resumen
// Response: { totalSemestre: number, variacionPct: number, sesionPromedioMin: number }
export function getResumenHistorialMock() {
  return {
    totalSemestre: 127,
    variacionPct: 12,
    miniBarras: [18, 22, 15, 27, 24, 21],
    sesionPromedioMin: 95,
  }
}
