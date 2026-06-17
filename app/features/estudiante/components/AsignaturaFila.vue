<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
import type { AsignaturaMatriculada } from '../api/asignaturas.mock'

defineProps<{ asignatura: AsignaturaMatriculada }>()

const HOY = new Date().toISOString().slice(0, 10)

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}`
}
</script>

<template>
  <div class="flex items-center gap-4 rounded-xl border border-default bg-surface px-4 py-3.5">
    <!-- Badge código -->
    <span
      class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide text-white"
      style="background-color: #0891B2;"
    >
      {{ asignatura.codigo }}
    </span>

    <!-- Info -->
    <div class="min-w-0 flex-1">
      <p class="truncate font-semibold text-ink">{{ asignatura.nombre }}</p>
      <p class="mt-0.5 text-xs text-faint">Grupo {{ asignatura.grupo }}</p>
    </div>

    <!-- Próxima sesión -->
    <div v-if="asignatura.proximaSesion" class="shrink-0 text-right">
      <span
        v-if="asignatura.proximaSesion.fecha === HOY"
        class="mb-1 inline-flex items-center rounded-full bg-ok/10 px-2 py-0.5 text-xs font-bold text-ok"
      >
        HOY
      </span>
      <p v-else class="flex items-center gap-1 text-xs text-faint">
        <Calendar class="h-3 w-3" />
        {{ formatearFecha(asignatura.proximaSesion.fecha) }}
      </p>
      <p class="text-xs text-faint">{{ asignatura.proximaSesion.horaInicio }}</p>
    </div>
    <p v-else class="shrink-0 text-xs text-faint">Sin próxima sesión</p>
  </div>
</template>
