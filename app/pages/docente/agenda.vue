<script setup lang="ts">
import EstadoBadge from '~/components/shared/EstadoBadge.vue'
import { useAgenda } from '~/features/docente/composables/useAgenda'
import type { EntradaEstado } from '~/features/docente/api/agenda.mock'
import { letraDia, numeroDia, tituloDia, esHoy } from '~/lib/fecha'

definePageMeta({ layout: 'docente' })

const { dias, laboratorios, labSeleccionado, isPending, isError } = useAgenda()

// Días únicos presentes en la agenda, para el selector superior.
const diasSelector = computed(() => dias.value.map((d) => d.fecha))

// Mapeo estado de entrada → props del badge.
const BADGE: Record<EntradaEstado, { label: string; tono: 'ok' | 'info' | 'warn' | 'danger' | 'neutral' }> = {
  en_curso: { label: 'EN CURSO', tono: 'ok' },
  programada: { label: 'PROGRAMADA', tono: 'info' },
  completada: { label: 'COMPLETADA', tono: 'neutral' },
  cancelada: { label: 'CANCELADA', tono: 'danger' },
}

// Color de la barra lateral según estado.
const BARRA: Record<EntradaEstado, string> = {
  en_curso: 'bg-ok',
  programada: 'bg-primary',
  completada: 'bg-faint',
  cancelada: 'bg-danger',
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <p class="text-sm font-semibold tracking-wide text-faint">MAYO 2026</p>
    <h1 class="mt-1 text-3xl font-bold text-ink">Mi agenda</h1>

    <!-- Selector de días -->
    <div class="mt-6 flex gap-3">
      <div
        v-for="fecha in diasSelector"
        :key="fecha"
        class="flex h-16 w-14 flex-col items-center justify-center rounded-xl border text-center"
        :class="esHoy(fecha)
          ? 'border-primary bg-primary text-on-primary'
          : 'border-default bg-surface text-ink'"
      >
        <span class="text-xs font-medium" :class="esHoy(fecha) ? 'text-on-primary/70' : 'text-faint'">
          {{ letraDia(fecha) }}
        </span>
        <span class="text-xl font-bold">{{ numeroDia(fecha) }}</span>
      </div>
    </div>

    <!-- Chips de laboratorio -->
    <div class="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="!labSeleccionado ? 'bg-accent-soft text-primary' : 'text-ink hover:bg-subtle'"
        @click="labSeleccionado = null"
      >
        Todos
      </button>
      <button
        v-for="lab in laboratorios"
        :key="lab"
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="labSeleccionado === lab ? 'bg-accent-soft text-primary' : 'text-ink hover:bg-subtle'"
        @click="labSeleccionado = lab"
      >
        {{ lab }}
      </button>
    </div>

    <!-- Estados -->
    <div v-if="isPending" class="mt-8 space-y-3">
      <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-2xl bg-subtle" />
    </div>

    <p v-else-if="isError" class="mt-8 text-faint">
      No se pudo cargar la agenda. Intenta recargar.
    </p>

    <p v-else-if="dias.length === 0" class="mt-8 text-faint">
      No hay sesiones para este filtro.
    </p>

    <!-- Lista agrupada por día -->
    <div v-else class="mt-8 space-y-8">
      <section v-for="dia in dias" :key="dia.fecha">
        <h2 class="flex items-center gap-2 text-sm font-semibold tracking-wide text-cobre">
          <span class="h-2 w-2 rounded-full bg-cobre" />
          {{ tituloDia(dia.fecha) }}<span v-if="esHoy(dia.fecha)"> · HOY</span>
        </h2>

        <div class="mt-3 space-y-3">
          <article
            v-for="e in dia.entradas"
            :key="e.id"
            class="flex items-center gap-5 overflow-hidden rounded-2xl border border-default bg-surface"
          >
            <span class="h-full w-1.5 self-stretch" :class="BARRA[e.estado]" />
            <div class="w-16 shrink-0 py-4 text-sm text-faint">
              <p class="font-semibold text-ink">{{ e.horaInicio }}</p>
              <p>{{ e.duracion }}</p>
            </div>
            <div class="flex-1 py-4">
              <p class="font-semibold text-ink">{{ e.titulo }}</p>
              <p class="text-sm text-faint">
                {{ e.laboratorio }}<span v-if="e.grupo"> · Grupo {{ e.grupo }}</span>
                <span v-else> · Tutorías</span>
              </p>
            </div>
            <div class="pr-5">
              <EstadoBadge
                v-if="e.estado === 'en_curso'"
                :label="BADGE[e.estado].label"
                :tono="BADGE[e.estado].tono"
                punto
              />
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
