import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getPrestamosMock } from '../api/prestamos.mock'
import type { PrestamoEstado } from '~/types/domain'

/**
 * Lista de préstamos, opcionalmente filtrada por estado.
 * Usada en: index (activos recientes), devolucion (activos seleccionables).
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<PrestamoDetalle[]>(`/auxiliar/prestamos?estado=${estado?.value ?? ''}`)
 */
export function usePrestamos(estado?: Ref<PrestamoEstado | undefined>) {
  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['auxiliar', 'prestamos', estado?.value]),
    queryFn: () => getPrestamosMock(estado?.value),
    staleTime: 15_000,
  })
  return { data, isPending, isError }
}
