import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { devolverPrestamoMock } from '../api/prestamos.mock'

/**
 * Mutación: registrar la devolución de un préstamo activo.
 * Invalida préstamos, stats y historial para mantener la UI consistente.
 * TODO(backend): reemplazar mutationFn por:
 *   ({ id, estadoEquipo, observaciones }) =>
 *     $fetch(`/auxiliar/prestamos/${id}/devolver`, {
 *       method: 'PATCH',
 *       body: { estadoEquipo, observaciones },
 *     })
 */
export function useDevolucion() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({
      id,
      estadoEquipo,
      observaciones,
    }: {
      id: string
      estadoEquipo: 'buen_estado' | 'con_danos' | 'requiere_mantenimiento'
      observaciones?: string
    }) => devolverPrestamoMock(id, estadoEquipo, observaciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auxiliar', 'prestamos'] })
      queryClient.invalidateQueries({ queryKey: ['auxiliar', 'equipos', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['auxiliar', 'historial'] })
    },
  })

  return { mutateAsync, isPending, isError, isSuccess }
}
