import { useQuery } from '@tanstack/vue-query'
import { fetchContextoIncidenciaMock } from '../api/incidencia.mock'

/** TODO(backend): GET /docente/sesiones/:id/contexto-incidencia */
export function useContextoIncidencia(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'contexto-incidencia', id],
    queryFn: () => fetchContextoIncidenciaMock(id),
    staleTime: 60_000,
  })
  return { data, isPending, isError }
}
