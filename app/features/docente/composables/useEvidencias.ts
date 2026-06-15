import { useQuery } from '@tanstack/vue-query'
import { fetchEvidenciasMock } from '../api/evidencias.mock'

/** TODO(backend): GET /docente/sesiones/:id/evidencias */
export function useEvidencias(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'evidencias', id],
    queryFn: () => fetchEvidenciasMock(id),
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
