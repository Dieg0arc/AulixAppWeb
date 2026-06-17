<script setup lang="ts">
import { History, QrCode, Hash } from 'lucide-vue-next'
import { useHistorialEstudiante } from '~/features/estudiante/composables/useHistorialEstudiante'

definePageMeta({ layout: 'estudiante' })

const { data: registros, isPending, isError } = useHistorialEstudiante()

const METODO_LABEL = { qr: 'QR', codigo: 'Código' } as const

function formatearFecha(fecha: string) {
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-ink">Historial</h1>
      <p class="mt-1 text-sm text-faint">Tus asistencias registradas.</p>
    </header>

    <!-- Carga -->
    <div v-if="isPending" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-xl bg-subtle" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="rounded-xl border border-default bg-surface p-6 text-sm text-faint">
      No se pudo cargar el historial. Intenta recargar.
    </div>

    <!-- Vacío -->
    <div
      v-else-if="!registros?.length"
      class="rounded-xl border border-dashed border-default bg-surface p-10 text-center"
    >
      <History class="mx-auto mb-3 h-8 w-8 text-faint" />
      <p class="text-sm font-medium text-faint">Sin elementos por ahora</p>
      <p class="mt-1 text-xs text-faint">Aún no tienes asistencias registradas.</p>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-2">
      <div
        v-for="registro in registros"
        :key="registro.id"
        class="flex items-center gap-4 rounded-xl border border-default bg-surface px-4 py-3.5"
      >
        <!-- Ícono de método -->
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ok/10">
          <QrCode v-if="registro.metodo === 'qr'" class="h-4 w-4 text-ok" />
          <Hash v-else class="h-4 w-4 text-ok" />
        </div>

        <!-- Datos -->
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium text-ink">{{ registro.practica }}</p>
          <p class="mt-0.5 text-xs text-faint">{{ registro.asignatura }} · {{ registro.laboratorio }}</p>
        </div>

        <!-- Fecha + método -->
        <div class="shrink-0 text-right">
          <p class="text-xs font-medium text-ink">{{ formatearFecha(registro.fecha) }}</p>
          <p class="mt-0.5 text-xs text-faint">{{ registro.hora }} · {{ METODO_LABEL[registro.metodo] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
