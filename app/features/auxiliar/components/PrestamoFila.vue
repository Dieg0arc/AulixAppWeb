<script setup lang="ts">
import EstadoBadge from '~/components/shared/EstadoBadge.vue'
import { tonoPrestamo } from './estadoTono'
import type { PrestamoDetalle } from '../api/prestamos.mock'

const props = defineProps<{
  prestamo: PrestamoDetalle
  seleccionable?: boolean
  seleccionado?: boolean
}>()

const emit = defineEmits<{
  seleccionar: [id: string]
}>()

const hora = computed(() =>
  new Date(props.prestamo.fechaPrestamo).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
)

const duracionLabel = computed(() => {
  const inicio = new Date(props.prestamo.fechaPrestamo).getTime()
  const fin = props.prestamo.fechaDevolucion
    ? new Date(props.prestamo.fechaDevolucion).getTime()
    : Date.now()
  const mins = Math.round((fin - inicio) / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
})

const etiquetaEstado: Record<string, string> = {
  activo: 'ACTIVO',
  devuelto: 'DEVUELTO',
  vencido: 'VENCIDO',
}
</script>

<template>
  <div
    class="flex items-center gap-4 rounded-xl border border-default bg-surface px-4 py-3 transition-colors"
    :class="[
      seleccionable ? 'cursor-pointer hover:bg-subtle' : '',
      seleccionado ? 'border-primary bg-accent-soft' : '',
    ]"
    @click="seleccionable && emit('seleccionar', prestamo.id)"
  >
    <!-- avatar solicitante -->
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
    >
      {{ prestamo.solicitante.avatarIniciales }}
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-ink">{{ prestamo.equipo.nombre }}</p>
      <p class="truncate text-xs text-faint">
        {{ prestamo.equipo.numeroSerie }} · {{ prestamo.solicitante.nombre }} · {{ duracionLabel }}
      </p>
    </div>

    <div class="flex shrink-0 flex-col items-end gap-1">
      <EstadoBadge
        :label="etiquetaEstado[prestamo.estado] ?? prestamo.estado.toUpperCase()"
        :tono="tonoPrestamo(prestamo.estado)"
        :punto="true"
      />
      <span class="text-xs text-faint">{{ hora }}</span>
    </div>
  </div>
</template>
