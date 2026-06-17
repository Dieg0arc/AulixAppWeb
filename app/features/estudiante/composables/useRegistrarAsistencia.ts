import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { registrarAsistenciaMock } from '../api/sesionAbierta.mock'
import type { ComprobanteAsistencia } from '../api/sesionAbierta.mock'

/**
 * Mutación: el estudiante registra su asistencia (por QR o código).
 * Al completarse invalida la caché de historial para que refleje la nueva entrada.
 * El comprobante se almacena en useState para que la pantalla de comprobante lo lea.
 * TODO(backend): reemplazar mutationFn por:
 *   (payload) => $fetch<ComprobanteAsistencia>('/estudiante/asistencia', { method: 'POST', body: payload })
 */
export function useRegistrarAsistencia() {
  const queryClient = useQueryClient()
  const comprobante = useState<ComprobanteAsistencia | null>('estudiante:comprobante', () => null)

  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: registrarAsistenciaMock,
    onSuccess: (resultado) => {
      comprobante.value = resultado
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'historial'] })
    },
  })

  return { mutateAsync, isPending, isError, isSuccess, comprobante }
}
