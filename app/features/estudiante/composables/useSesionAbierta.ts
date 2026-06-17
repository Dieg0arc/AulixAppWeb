import { useQuery } from '@tanstack/vue-query'
import { fetchSesionAbiertaMock } from '../api/sesionAbierta.mock'

/**
 * Sesión que el docente tiene abierta para una de las asignaturas del estudiante.
 * null = no hay sesión abierta en este momento.
 * staleTime corto para que el estudiante vea la apertura casi en tiempo real (sin WS).
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<SesionAbierta | null>('/estudiante/sesion-abierta')
 */
export function useSesionAbierta() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['estudiante', 'sesion-abierta'],
    queryFn: fetchSesionAbiertaMock,
    staleTime: 20_000,
    refetchInterval: 30_000,
  })
  return { data, isPending, isError }
}
