import { ref, onScopeDispose } from 'vue'
import { conectarAsistenciaMock } from '../realtime/socket.mock'
import type { AttendanceMarked, AttendanceRejected } from '../realtime/contract'

/** Una entrada del feed en vivo: marca exitosa o rechazo. */
export type EntradaFeed =
  | (AttendanceMarked & { kind: 'marca' })
  | (AttendanceRejected & { kind: 'rechazo' })

/**
 * Asistencia en vivo de una sesión. Abstrae el transporte (hoy mock, mañana WS).
 * Estado efímero de tiempo real → ref local, NO TanStack Query (no es cacheable
 * ni refetcheable; es un stream).
 *
 * TODO(backend): el socket real se enchufa en realtime/socket.mock.ts.
 */
export function useAsistenciaEnVivo(opts: { totalEsperado: number; confirmadosIniciales: number }) {
  const confirmados = ref(opts.confirmadosIniciales)
  const total = ref(opts.totalEsperado)
  const feed = ref<EntradaFeed[]>([])

  const desconectar = conectarAsistenciaMock((e) => {
    if (e.tipo === 'asistencia.conteo') {
      confirmados.value = e.confirmados
      total.value = e.total
    } else if (e.tipo === 'asistencia.marcada') {
      feed.value.unshift({ ...e, kind: 'marca' })
    } else if (e.tipo === 'asistencia.rechazada') {
      feed.value.unshift({ ...e, kind: 'rechazo' })
    }
    // Mantener el feed acotado (no crece infinito).
    if (feed.value.length > 30) feed.value = feed.value.slice(0, 30)
  }, opts)

  // Cierra el socket al desmontar la pantalla.
  onScopeDispose(desconectar)

  return { confirmados, total, feed }
}
