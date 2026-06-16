<script setup lang="ts">
import EstadoBadge from '~/components/shared/EstadoBadge.vue'
import { tonoEquipo } from './estadoTono'
import type { EquipoConEstado } from '../api/equipos.mock'

const props = defineProps<{
  equipo: EquipoConEstado
  seleccionado?: boolean
  vencimiento?: string | null // HH:MM — para equipos en estado 'prestado'
  desdeLabel?: string         // "DD may" — para equipos en 'reparacion'
}>()

const emit = defineEmits<{
  seleccionar: [id: string]
}>()

const esSeleccionable = computed(() => props.equipo.estado === 'disponible')

const etiquetaEstado = computed<string>(() => {
  if (props.equipo.estado === 'prestado' && props.vencimiento)
    return `vence ${props.vencimiento}`
  if (props.equipo.estado === 'reparacion' && props.desdeLabel)
    return `desde ${props.desdeLabel}`
  const labels: Record<string, string> = {
    disponible: 'DISPONIBLE',
    prestado: 'PRESTADO',
    reparacion: 'REPARACIÓN',
    mantenimiento: 'MANTENIMIENTO',
  }
  return labels[props.equipo.estado] ?? props.equipo.estado.toUpperCase()
})
</script>

<template>
  <div
    class="flex items-center gap-4 rounded-xl border border-default bg-surface px-4 py-3 transition-colors"
    :class="[
      esSeleccionable ? 'cursor-pointer hover:bg-subtle' : 'opacity-60',
      seleccionado ? 'border-primary bg-accent-soft' : '',
    ]"
    @click="esSeleccionable && emit('seleccionar', equipo.id)"
  >
    <!-- check de selección -->
    <div
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
      :class="
        seleccionado
          ? 'border-primary bg-primary'
          : esSeleccionable
            ? 'border-default'
            : 'border-default opacity-30'
      "
    >
      <svg v-if="seleccionado" class="h-3 w-3 text-on-primary" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-ink">{{ equipo.nombre }}</p>
      <p class="truncate text-xs text-faint">{{ equipo.numeroSerie }} · {{ equipo.tipo }}</p>
    </div>

    <EstadoBadge :label="etiquetaEstado" :tono="tonoEquipo(equipo.estado)" :punto="true" />
  </div>
</template>
