import { useQuery } from '@tanstack/vue-query'
import { getEquipoStatsMock } from '../api/equipos.mock'

/**
 * Estadísticas de equipos del laboratorio del auxiliar.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<EquipoStats>('/auxiliar/equipos/stats')
 */
export function useEquiposStats() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['auxiliar', 'equipos', 'stats'],
    queryFn: getEquipoStatsMock,
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
