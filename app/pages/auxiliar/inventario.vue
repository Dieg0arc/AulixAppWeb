<script setup lang="ts">
import AppCard from '~/components/ui/AppCard.vue'
import OcupacionBars from '~/features/auxiliar/components/OcupacionBars.vue'
import { useInventario } from '~/features/auxiliar/composables/useInventario'
import type { RangoInventario } from '~/features/auxiliar/api/inventario.mock'

definePageMeta({ layout: 'auxiliar' })

type RangoChip = { key: RangoInventario; label: string }
const rangos: RangoChip[] = [
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
  { key: 'semestre', label: 'Semestre' },
]
const rango = ref<RangoInventario>('semana')

const { data: metricas, isPending } = useInventario(rango)

// SVG anillo de disponibilidad
const RADIO = 40
const CIRCUNFERENCIA = 2 * Math.PI * RADIO
const dashOffset = computed(() => {
  const pct = metricas.value?.disponibilidadPct ?? 0
  return CIRCUNFERENCIA * (1 - pct / 100)
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <!-- Encabezado + filtros -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-ink">Inventario</h1>
        <p class="mt-1 text-sm text-faint">Ocupación y estado de equipos del laboratorio.</p>
      </div>

      <!-- Chips rango -->
      <div class="flex gap-1 rounded-xl border border-default bg-surface p-1">
        <button
          v-for="r in rangos"
          :key="r.key"
          type="button"
          class="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            rango === r.key
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-faint hover:text-ink'
          "
          @click="rango = r.key"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="grid gap-4 sm:grid-cols-2">
      <div v-for="i in 4" :key="i" class="h-40 animate-pulse rounded-2xl bg-subtle" />
    </div>

    <template v-else-if="metricas">
      <!-- Anillo disponibilidad + sesión promedio -->
      <div class="grid gap-4 sm:grid-cols-2">
        <AppCard>
          <p class="mb-4 text-xs font-semibold tracking-wide text-faint">DISPONIBILIDAD</p>
          <div class="flex items-center gap-6">
            <!-- Anillo SVG -->
            <svg width="100" height="100" viewBox="0 0 100 100" class="shrink-0 -rotate-90">
              <circle
                cx="50" cy="50" :r="RADIO"
                fill="none" stroke-width="12"
                class="stroke-subtle"
              />
              <circle
                cx="50" cy="50" :r="RADIO"
                fill="none" stroke-width="12"
                class="stroke-primary transition-all duration-700"
                :stroke-dasharray="CIRCUNFERENCIA"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
              />
            </svg>
            <div>
              <p class="text-4xl font-bold text-ink">{{ metricas.disponibilidadPct }}%</p>
              <p class="mt-1 text-xs text-faint">equipos disponibles</p>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <p class="mb-4 text-xs font-semibold tracking-wide text-faint">SESIÓN PROMEDIO</p>
          <p class="text-4xl font-bold text-ink">{{ metricas.sesionPromedioMin }}<span class="text-lg font-normal text-faint"> min</span></p>
          <p class="mt-2 text-xs text-faint">por préstamo en este período</p>
        </AppCard>
      </div>

      <!-- Tasa de ocupación por laboratorio -->
      <AppCard>
        <p class="mb-4 text-xs font-semibold tracking-wide text-faint">TASA DE OCUPACIÓN POR LABORATORIO</p>
        <OcupacionBars :labs="metricas.ocupacionPorLab" />
      </AppCard>

      <!-- 4 stats equipos -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AppCard>
          <p class="text-xs font-semibold tracking-wide text-faint">PRESTADOS AHORA</p>
          <p class="mt-2 text-3xl font-bold text-ink">{{ metricas.prestadosAhora }}</p>
        </AppCard>

        <AppCard>
          <p class="text-xs font-semibold tracking-wide text-faint">TASA RETORNO</p>
          <p class="mt-2 text-3xl font-bold text-ink">{{ metricas.tasaRetornoPct }}%</p>
        </AppCard>

        <AppCard>
          <p class="text-xs font-semibold tracking-wide text-faint">PRÉSTAMO PROM.</p>
          <p class="mt-2 text-3xl font-bold text-ink">{{ metricas.prestamoPromedioMin }}<span class="text-base font-normal text-faint">m</span></p>
        </AppCard>

        <AppCard>
          <p class="text-xs font-semibold tracking-wide text-faint">EN REPARACIÓN</p>
          <p class="mt-2 text-3xl font-bold text-ink">{{ metricas.enReparacion }}</p>
        </AppCard>
      </div>
    </template>
  </div>
</template>
