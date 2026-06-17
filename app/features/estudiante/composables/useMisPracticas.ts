import { useQuery } from '@tanstack/vue-query'
import { fetchAsignaturasMock } from '../api/asignaturas.mock'

/**
 * Asignaturas en las que el estudiante está matriculado este semestre,
 * con la próxima sesión de cada una.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<AsignaturaMatriculada[]>('/estudiante/asignaturas')
 */
export function useMisPracticas() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['estudiante', 'asignaturas'],
    queryFn: fetchAsignaturasMock,
    staleTime: 60_000,
  })
  return { data, isPending, isError }
}
