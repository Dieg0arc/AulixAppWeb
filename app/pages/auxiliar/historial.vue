<script setup lang="ts">
import AppCard from '~/components/ui/AppCard.vue'
import HistorialDiaGroup from '~/features/auxiliar/components/HistorialDiaGroup.vue'
import { useHistorial, useResumenHistorial } from '~/features/auxiliar/composables/useHistorial'
import type { PrestamoEstado } from '~/types/domain'

definePageMeta({ layout: 'auxiliar' })

type TabKey = 'todos' | PrestamoEstado
const tabs: { key: TabKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'activo', label: 'Activos' },
  { key: 'devuelto', label: 'Devueltos' },
  { key: 'vencido', label: 'Vencidos' },
]
const tabActivo = ref<TabKey>('todos')

const filtro = computed<PrestamoEstado | undefined>(() =>
  tabActivo.value === 'todos' ? undefined : tabActivo.value,
)

const { data: grupos, isPending } = useHistorial(filtro)
const { data: resumen } = useResumenHistorial()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-ink">Historial</h1>
      <p class="mt-1 text-sm text-faint">Todos los préstamos registrados.</p>
    </header>

    <!-- Card resumen semestre -->
    <AppCard v-if="resumen">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-semibold tracking-wide text-faint">TOTAL SEMESTRE</p>
          <p class="mt-1 text-4xl font-bold text-ink">{{ resumen.totalSemestre }}</p>
          <p class="mt-1 text-sm font-medium text-ok">+{{ resumen.variacionPct }}% vs abril</p>
        </div>
        <!-- Mini barras -->
        <div class="flex h-10 items-end gap-1">
          <div
            v-for="(val, i) in resumen.miniBarras"
            :key="i"
            class="w-3 rounded-t bg-primary/30 transition-all"
            :style="{ height: `${(val / Math.max(...resumen.miniBarras)) * 100}%` }"
          />
        </div>
      </div>
      <p class="mt-3 text-xs text-faint">
        Sesión promedio: {{ resumen.sesionPromedioMin }} min
      </p>
    </AppCard>

    <!-- Tabs -->
    <div class="flex gap-1 rounded-xl border border-default bg-surface p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
        :class="
          tabActivo === tab.key
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-faint hover:text-ink'
        "
        @click="tabActivo = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Lista agrupada por día -->
    <div v-if="isPending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-xl bg-subtle" />
    </div>

    <div v-else-if="!grupos?.length" class="rounded-xl border border-default bg-surface p-8 text-center text-sm text-faint">
      No hay préstamos en esta categoría.
    </div>

    <div v-else class="space-y-6">
      <HistorialDiaGroup
        v-for="grupo in grupos"
        :key="grupo.fecha"
        :grupo="grupo"
      />
    </div>
  </div>
</template>
