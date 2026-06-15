<script setup lang="ts">
import { useIndicadores } from '~/features/docente/composables/useIndicadores'
import type { Periodo } from '~/features/docente/api/indicadores.mock'

definePageMeta({ layout: 'docente' })

const { data, isPending, isError, periodo } = useIndicadores()

const PERIODOS: { valor: Periodo; label: string }[] = [
  { valor: 'semana', label: 'Semana' },
  { valor: 'mes', label: 'Mes' },
  { valor: 'semestre', label: 'Semestre' },
]

// Color de la barra de asistencia según el nivel.
function colorAsistencia(pct: number): string {
  if (pct >= 85) return 'bg-ok'
  if (pct >= 75) return 'bg-primary'
  return 'bg-warn'
}

// Iniciales del estudiante para el avatar.
function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase()
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <!-- Cabecera + selector de periodo -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold tracking-wide text-faint">DOCENTE · MIS CURSOS</p>
        <h1 class="mt-1 text-3xl font-bold text-ink">Indicadores</h1>
      </div>
      <div class="flex rounded-xl border border-default bg-surface p-1">
        <button
          v-for="p in PERIODOS"
          :key="p.valor"
          type="button"
          class="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
          :class="periodo === p.valor ? 'bg-primary text-on-primary' : 'text-faint hover:text-ink'"
          @click="periodo = p.valor"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isPending" class="mt-8 grid grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="h-32 animate-pulse rounded-2xl bg-subtle" />
    </div>

    <p v-else-if="isError" class="mt-8 text-faint">
      No se pudieron cargar los indicadores. Intenta recargar.
    </p>

    <template v-else-if="data">
      <!-- Métricas -->
      <div class="mt-8 grid grid-cols-3 gap-4">
        <article class="rounded-2xl border border-default bg-surface p-6">
          <p class="text-4xl font-bold text-ok">{{ data.resumen.asistenciaPromedio }}%</p>
          <p class="mt-2 text-sm text-faint">Asistencia promedio</p>
          <p
            v-if="data.resumen.deltaAsistencia !== 0"
            class="mt-3 text-xs font-medium"
            :class="data.resumen.deltaAsistencia > 0 ? 'text-ok' : 'text-danger'"
          >
            {{ data.resumen.deltaAsistencia > 0 ? '▲' : '▼' }}
            {{ Math.abs(data.resumen.deltaAsistencia) }} vs. periodo anterior
          </p>
        </article>
        <article class="rounded-2xl border border-default bg-surface p-6">
          <p class="text-4xl font-bold text-ink">{{ data.resumen.sesionesDictadas }}</p>
          <p class="mt-2 text-sm text-faint">Sesiones dictadas</p>
        </article>
        <article class="rounded-2xl border border-default bg-surface p-6">
          <p class="text-4xl font-bold text-danger">{{ data.resumen.inasistenciasCriticas }}</p>
          <p class="mt-2 text-sm text-faint">Inasist. críticas</p>
        </article>
      </div>

      <!-- Asistencia por asignatura -->
      <section class="mt-6 rounded-2xl border border-default bg-surface p-6">
        <h2 class="text-xs font-semibold tracking-wide text-faint">
          ASISTENCIA POR ASIGNATURA · TASA POR SESIÓN
        </h2>
        <div class="mt-5 space-y-5">
          <div v-for="a in data.asistenciaPorAsignatura" :key="a.asignatura">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-ink">{{ a.asignatura }}</span>
              <span class="text-sm font-semibold text-ink">{{ a.porcentaje }}%</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-subtle">
              <div
                class="h-full rounded-full transition-all"
                :class="colorAsistencia(a.porcentaje)"
                :style="{ width: `${a.porcentaje}%` }"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Estado de reservas -->
      <section class="mt-6 rounded-2xl border border-default bg-surface p-6">
        <h2 class="text-xs font-semibold tracking-wide text-faint">ESTADO DE RESERVAS</h2>
        <div class="mt-4 flex h-3 overflow-hidden rounded-full">
          <div class="bg-ok" :style="{ width: `${data.estadoReservas.completadas}%` }" />
          <div class="bg-warn" :style="{ width: `${data.estadoReservas.pendientes}%` }" />
          <div class="bg-danger" :style="{ width: `${data.estadoReservas.canceladas}%` }" />
        </div>
        <div class="mt-4 flex flex-wrap gap-5 text-sm">
          <span class="flex items-center gap-2 text-faint">
            <span class="h-2.5 w-2.5 rounded-full bg-ok" />
            Completadas {{ data.estadoReservas.completadas }}%
          </span>
          <span class="flex items-center gap-2 text-faint">
            <span class="h-2.5 w-2.5 rounded-full bg-warn" />
            Pendientes {{ data.estadoReservas.pendientes }}%
          </span>
          <span class="flex items-center gap-2 text-faint">
            <span class="h-2.5 w-2.5 rounded-full bg-danger" />
            Canceladas {{ data.estadoReservas.canceladas }}%
          </span>
        </div>
      </section>

      <!-- Inasistencias críticas -->
      <section class="mt-6 rounded-2xl border border-default bg-surface p-6">
        <h2 class="text-xs font-semibold tracking-wide text-faint">INASISTENCIAS CRÍTICAS</h2>
        <div class="mt-4 space-y-3">
          <div
            v-for="i in data.inasistenciasCriticas"
            :key="i.estudiante"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
                {{ iniciales(i.estudiante) }}
              </div>
              <span class="text-sm font-medium text-ink">{{ i.estudiante }}</span>
            </div>
            <span class="rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
              {{ i.faltas }} faltas
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
