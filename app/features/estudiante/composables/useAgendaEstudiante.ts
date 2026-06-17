import { useQuery } from '@tanstack/vue-query'
import { fetchAgendaMock } from '../api/agenda.mock'

/**
 * Próximas prácticas del estudiante en la semana en curso.
 * TODO(backend): reemplazar queryFn por:
 *   () => $fetch<AgendaSesion[]>('/estudiante/agenda')
 */
export function useAgendaEstudiante() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['estudiante', 'agenda'],
    queryFn: fetchAgendaMock,
    staleTime: 60_000,
  })
  return { data, isPending, isError }
}
