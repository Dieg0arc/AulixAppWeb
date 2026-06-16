import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getInventarioMetricasMock } from '../api/inventario.mock'
import type { RangoInventario } from '../api/inventario.mock'

/**
 * Métricas de inventario para la pantalla Inventario.
 * El rango es reactivo: cambiar el chip Semana/Mes/Semestre dispara nueva query.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<InventarioMetricas>(`/auxiliar/inventario/metricas?rango=${rango.value}`)
 */
export function useInventario(rango: Ref<RangoInventario>) {
  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['auxiliar', 'inventario', rango.value]),
    queryFn: () => getInventarioMetricasMock(rango.value),
    staleTime: 30_000,
  })
  return { data, isPending, isError }
}
