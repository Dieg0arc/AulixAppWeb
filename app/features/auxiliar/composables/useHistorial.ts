import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getHistorialMock, getResumenHistorialMock } from '../api/historial.mock'
import type { PrestamoEstado } from '~/types/domain'

/**
 * Historial de préstamos agrupado por día.
 * El filtro de estado es reactivo: cambia el tab → nueva query.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<HistorialDia[]>(`/auxiliar/historial?estado=${filtro.value ?? ''}`)
 */
export function useHistorial(filtro?: Ref<PrestamoEstado | undefined>) {
  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['auxiliar', 'historial', filtro?.value]),
    queryFn: () => getHistorialMock(filtro?.value),
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}

/**
 * Resumen del semestre para el card superior del historial.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch('/auxiliar/historial/resumen')
 */
export function useResumenHistorial() {
  const { data, isPending } = useQuery({
    queryKey: ['auxiliar', 'historial', 'resumen'],
    queryFn: getResumenHistorialMock,
    staleTime: 60_000,
  })
  return { data, isPending }
}
