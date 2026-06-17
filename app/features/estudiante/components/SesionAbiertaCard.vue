<script setup lang="ts">
import { QrCode, Hash } from 'lucide-vue-next'
import type { SesionAbierta } from '../api/sesionAbierta.mock'

defineProps<{ sesion: SesionAbierta }>()
defineEmits<{ escanearQr: []; ingresarCodigo: [] }>()
</script>

<template>
  <div class="rounded-2xl border-2 overflow-hidden" style="border-color: #0891B2;">
    <!-- Banner de estado -->
    <div class="px-5 py-2.5 flex items-center gap-2" style="background-color: #0891B2;">
      <span class="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
      <p class="text-xs font-bold tracking-widest text-white">EN CURSO · ABIERTA POR TU DOCENTE</p>
    </div>

    <!-- Contenido -->
    <div class="bg-surface px-6 py-5">
      <h2 class="text-xl font-bold text-ink">{{ sesion.practica }}</h2>
      <p class="mt-1 text-sm text-faint">
        {{ sesion.asignatura }} <span class="mx-1">·</span> {{ sesion.laboratorio }}
      </p>

      <!-- Acciones -->
      <div class="mt-5 flex gap-3">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style="background-color: #0891B2;"
          @click="$emit('escanearQr')"
        >
          <QrCode class="h-5 w-5" />
          Escanear QR
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-colors hover:bg-subtle"
          style="border-color: #0891B2; color: #0891B2;"
          @click="$emit('ingresarCodigo')"
        >
          <Hash class="h-5 w-5" />
          Código
        </button>
      </div>
    </div>
  </div>
</template>
