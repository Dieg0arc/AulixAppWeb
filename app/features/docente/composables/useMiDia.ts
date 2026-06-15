import { useQuery } from '@tanstack/vue-query'
import { fetchMiDiaMock } from '../api/sesiones.mock'

/**
 * Datos de la pantalla "Mi día" del docente.
 * Estado de SERVIDOR → TanStack Query (no Pinia).
 *
 * TODO(backend): reemplazar `fetchMiDiaMock` por:
 *   () => $fetch<SesionResumen[]>('/docente/mi-dia')
 * El resto del composable y los componentes no cambian.
 */
export function useMiDia() {
  return useQuery({
    queryKey: ['docente', 'mi-dia'],
    queryFn: fetchMiDiaMock,
    staleTime: 60_000,
  })
}
