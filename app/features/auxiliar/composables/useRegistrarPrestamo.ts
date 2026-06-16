import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { registrarPrestamoMock } from '../api/prestamos.mock'

/**
 * Mutación: registrar un nuevo préstamo de equipo.
 * Al completarse, invalida la caché de préstamos para que index y
 * devolucion reflejen el nuevo estado sin recargar manualmente.
 * TODO(backend): reemplazar mutationFn por:
 *   (payload) => $fetch('/auxiliar/prestamos', { method: 'POST', body: payload })
 */
export function useRegistrarPrestamo() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: registrarPrestamoMock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auxiliar', 'prestamos'] })
      queryClient.invalidateQueries({ queryKey: ['auxiliar', 'equipos', 'stats'] })
    },
  })

  return { mutateAsync, isPending, isError, isSuccess }
}
