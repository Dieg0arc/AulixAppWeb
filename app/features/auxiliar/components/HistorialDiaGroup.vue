<script setup lang="ts">
import PrestamoFila from './PrestamoFila.vue'
import type { HistorialDia } from '../api/historial.mock'

defineProps<{
  grupo: HistorialDia
}>()
</script>

<template>
  <div>
    <p class="mb-2 text-xs font-semibold tracking-widest text-faint">{{ grupo.etiqueta }}</p>
    <div class="space-y-2">
      <PrestamoFila
        v-for="prestamo in grupo.prestamos"
        :key="prestamo.id"
        :prestamo="prestamo"
      />
    </div>
  </div>
</template>
