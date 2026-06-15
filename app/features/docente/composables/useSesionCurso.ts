import { useQuery } from '@tanstack/vue-query'
import { fetchSesionCursoMock } from '../api/sesionCurso.mock'

/**
 * Estado de una sesión activa. TanStack Query.
 * TODO(backend): GET /docente/sesiones/:id/estado
 */
export function useSesionCurso(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'sesion-curso', id],
    queryFn: () => fetchSesionCursoMock(id),
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
