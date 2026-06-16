import { useQuery } from '@tanstack/vue-query'
import { fetchResumenCierreMock } from '../api/cierre.mock'

/** TODO(backend): GET /docente/sesiones/:id/resumen-cierre */
export function useCierre(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'cierre', id],
    queryFn: () => fetchResumenCierreMock(id),
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
