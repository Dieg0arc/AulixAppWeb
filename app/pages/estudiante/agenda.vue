<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next'
import { useAgendaEstudiante } from '~/features/estudiante/composables/useAgendaEstudiante'

definePageMeta({ layout: 'estudiante' })

const { data: sesiones, isPending, isError } = useAgendaEstudiante()

const HOY = new Date().toISOString().slice(0, 10)

function formatearFechaLarga(fecha: string) {
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-ink">Agenda</h1>
      <p class="mt-1 text-sm text-faint">Tus próximas prácticas de la semana.</p>
    </header>

    <!-- Carga -->
    <div v-if="isPending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-xl bg-subtle" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="rounded-xl border border-default bg-surface p-6 text-sm text-faint">
      No se pudo cargar la agenda. Intenta recargar.
    </div>

    <!-- Vacío -->
    <div
      v-else-if="!sesiones?.length"
      class="rounded-xl border border-dashed border-default bg-surface p-10 text-center"
    >
      <Calendar class="mx-auto mb-3 h-8 w-8 text-faint" />
      <p class="text-sm font-medium text-faint">Sin elementos por ahora</p>
      <p class="mt-1 text-xs text-faint">No tienes prácticas programadas esta semana.</p>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-3">
      <div
        v-for="sesion in sesiones"
        :key="sesion.id"
        class="flex items-start gap-4 rounded-xl border border-default bg-surface px-5 py-4"
      >
        <!-- Indicador de color del día -->
        <div
          class="mt-0.5 flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl"
          :class="sesion.fecha === HOY ? 'text-white' : 'bg-accent-soft'"
          :style="sesion.fecha === HOY ? { backgroundColor: '#0891B2' } : {}"
        >
          <span class="text-xs font-bold leading-none">
            {{ new Date(sesion.fecha + 'T00:00:00').getDate() }}
          </span>
          <span class="text-[10px] leading-none opacity-80">
            {{ new Date(sesion.fecha + 'T00:00:00').toLocaleDateString('es-CO', { month: 'short' }) }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-ink">{{ sesion.practica }}</p>
            <span
              v-if="sesion.fecha === HOY"
              class="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style="background-color: #0891B2;"
            >
              HOY
            </span>
          </div>
          <p class="mt-0.5 text-sm text-faint">{{ sesion.asignatura }} · {{ sesion.laboratorio }}</p>
          <p class="mt-1 flex items-center gap-1 text-xs text-faint">
            <Clock class="h-3 w-3" />
            {{ sesion.horaInicio }} – {{ sesion.horaFin }}
          </p>
        </div>

        <span class="shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold text-white" style="background-color: #0891B2;">
          {{ sesion.codigo }}
        </span>
      </div>
    </div>
  </div>
</template>
