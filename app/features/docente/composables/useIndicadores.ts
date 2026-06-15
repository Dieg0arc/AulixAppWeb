import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchIndicadoresMock, type Periodo } from '../api/indicadores.mock'

/**
 * Indicadores del docente. Estado de servidor → TanStack Query.
 * El periodo (semana/mes/semestre) es estado de UI local; al cambiarlo,
 * el queryKey reacciona y refetchea.
 *
 * TODO(backend): reemplazar fetchIndicadoresMock por
 *   () => $fetch('/docente/indicadores', { query: { periodo: periodo.value } })
 */
export function useIndicadores() {
  const periodo = ref<Periodo>('mes')

  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'indicadores', periodo],
    queryFn: () => fetchIndicadoresMock(periodo.value),
    staleTime: 60_000,
  })

  return { data, isPending, isError, periodo }
}
