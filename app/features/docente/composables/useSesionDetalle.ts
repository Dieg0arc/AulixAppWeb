import { useQuery } from '@tanstack/vue-query'
import { fetchSesionDetalleMock } from '../api/sesion.mock'

/**
 * Detalle de una sesión para el flujo de apertura/curso/cierre.
 * TODO(backend): reemplazar por $fetch(`/docente/sesiones/${id}`)
 */
export function useSesionDetalle(id: string) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'sesion', id],
    queryFn: () => fetchSesionDetalleMock(id),
    staleTime: 60_000,
  })
  return { data, isPending, isError }
}
