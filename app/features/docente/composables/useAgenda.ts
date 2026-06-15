import { useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { fetchAgendaMock, type EntradaAgenda } from '../api/agenda.mock'

export interface DiaAgenda {
  fecha: string
  entradas: EntradaAgenda[]
}

/**
 * Datos + lógica de la agenda del docente.
 * Estado de SERVIDOR (entradas) → TanStack Query.
 * Estado de UI (filtro de lab seleccionado) → ref local, no servidor.
 *
 * TODO(backend): reemplazar `fetchAgendaMock` por
 *   () => $fetch<EntradaAgenda[]>('/docente/agenda', { query: { desde, hasta } })
 */
export function useAgenda() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['docente', 'agenda'],
    queryFn: fetchAgendaMock,
    staleTime: 60_000,
  })

  // Filtro de laboratorio. null = "Todos".
  const labSeleccionado = ref<string | null>(null)

  // Labs disponibles, derivados de los datos (no hardcodeados).
  const laboratorios = computed(() => {
    const set = new Set((data.value ?? []).map((e) => e.laboratorio))
    return Array.from(set).sort()
  })

  // Entradas filtradas por lab y agrupadas por fecha.
  const dias = computed<DiaAgenda[]>(() => {
    const entradas = (data.value ?? []).filter(
      (e) => !labSeleccionado.value || e.laboratorio === labSeleccionado.value,
    )

    const grupos = new Map<string, EntradaAgenda[]>()
    for (const e of entradas) {
      if (!grupos.has(e.fecha)) grupos.set(e.fecha, [])
      grupos.get(e.fecha)!.push(e)
    }

    return Array.from(grupos.entries())
      .map(([fecha, entradas]) => ({
        fecha,
        entradas: entradas.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
  })

  return { dias, laboratorios, labSeleccionado, isPending, isError }
}
