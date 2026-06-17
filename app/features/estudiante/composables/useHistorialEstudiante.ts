import { useQuery } from '@tanstack/vue-query'
import { fetchHistorialMock } from '../api/historial.mock'

/**
 * Asistencias registradas del estudiante, más reciente primero.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<AsistenciaHistorial[]>('/estudiante/historial')
 */
export function useHistorialEstudiante() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['estudiante', 'historial'],
    queryFn: fetchHistorialMock,
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
