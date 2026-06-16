<script setup lang="ts">
import { QrCode, Clock, TriangleAlert, Camera, ArrowRight } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Acceso {
  label: string
  icon: Component
  tono: 'primary' | 'cobre'
  evento: 'qr' | 'codigo' | 'incidencia' | 'evidencias'
}

const emit = defineEmits<{
  seleccionar: [evento: Acceso['evento']]
}>()

const accesos: Acceso[] = [
  { label: 'Generar QR', icon: QrCode, tono: 'primary', evento: 'qr' },
  { label: 'Código de tiempo', icon: Clock, tono: 'primary', evento: 'codigo' },
  { label: 'Reportar incidencia', icon: TriangleAlert, tono: 'cobre', evento: 'incidencia' },
  { label: 'Evidencias', icon: Camera, tono: 'primary', evento: 'evidencias' },
]
</script>

<template>
  <section>
    <h2 class="text-sm font-semibold tracking-wide text-faint">ACCESOS RÁPIDOS</h2>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        v-for="acceso in accesos"
        :key="acceso.evento"
        type="button"
        class="group flex items-center gap-4 rounded-2xl border border-default bg-surface px-5 py-4 text-left transition-colors hover:bg-subtle"
        @click="emit('seleccionar', acceso.evento)"
      >
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="acceso.tono === 'cobre' ? 'bg-cobre/10 text-cobre' : 'bg-accent-soft text-primary'"
        >
          <component :is="acceso.icon" class="h-5 w-5" />
        </span>
        <span class="flex-1 font-semibold text-ink">{{ acceso.label }}</span>
        <ArrowRight class="h-5 w-5 text-faint transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </section>
</template>
