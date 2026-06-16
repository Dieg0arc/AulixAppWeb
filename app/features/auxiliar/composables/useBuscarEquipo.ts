import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { buscarEquiposMock } from '../api/equipos.mock'

/**
 * Búsqueda reactiva de equipos por texto libre.
 * La queryKey incluye el query para que TanStack re-dispare al cambiar.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<EquipoConEstado[]>(`/auxiliar/equipos/buscar?q=${q.value}`)
 */
export function useBuscarEquipo(q: Ref<string>) {
  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['auxiliar', 'equipos', 'buscar', q.value]),
    queryFn: () => buscarEquiposMock(q.value),
    staleTime: 10_000,
  })
  return { data, isPending, isError }
}
