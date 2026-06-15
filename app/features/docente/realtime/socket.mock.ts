import type { AttendanceEvent } from './contract'

/**
 * ⚠️ MOCK del WebSocket. Simula el backend emitiendo asistencias.
 *
 * TODO(backend): reemplazar por una conexión WebSocket real:
 *   const ws = new WebSocket(`${WS_URL}/docente/sesiones/${id}/asistencia`)
 *   ws.onmessage = (e) => onEvent(JSON.parse(e.data) as AttendanceEvent)
 *   return () => ws.close()
 *
 * La firma (callback + función de limpieza) es idéntica a la del WS real,
 * por eso el composable que lo consume no cambia.
 */

const NOMBRES = [
  'Pérez, Laura', 'Rojas, Andrés', 'Gutiérrez, Sofía', 'Castro, Juan',
  'Vargas, Julián', 'Mora, Elena', 'Díaz, Camilo', 'Ortiz, Valentina',
]

export function conectarAsistenciaMock(
  onEvent: (e: AttendanceEvent) => void,
  opts: { totalEsperado: number; confirmadosIniciales: number },
): () => void {
  let confirmados = opts.confirmadosIniciales
  let i = 0

  // Snapshot inicial.
  onEvent({ tipo: 'asistencia.conteo', confirmados, total: opts.totalEsperado })

  const intervalo = setInterval(() => {
    if (confirmados >= opts.totalEsperado) return

    // 1 de cada 5 simula un código inválido (para ver el estado de error).
    const esRechazo = Math.random() < 0.2
    const ahora = new Date()
    const hora = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })

    if (esRechazo) {
      onEvent({
        tipo: 'asistencia.rechazada',
        codigoIntentado: 'A' + Math.floor(1000 + Math.random() * 9000),
        motivo: 'codigo_invalido',
        hora,
        timestamp: ahora.getTime(),
      })
      return
    }

    const nombre = NOMBRES[i % NOMBRES.length]
    i++
    confirmados++
    onEvent({
      tipo: 'asistencia.marcada',
      estudianteId: 'est-' + i,
      nombre,
      metodo: Math.random() < 0.7 ? 'qr' : 'codigo',
      hora,
      timestamp: ahora.getTime(),
    })
    onEvent({ tipo: 'asistencia.conteo', confirmados, total: opts.totalEsperado })
  }, 3500)

  // Función de limpieza: cierra el "socket".
  return () => clearInterval(intervalo)
}
