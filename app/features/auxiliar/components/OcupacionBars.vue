<script setup lang="ts">
import type { OcupacionLab } from '../api/inventario.mock'

defineProps<{
  labs: OcupacionLab[]
}>()
</script>

<template>
  <div class="space-y-3">
    <div v-for="lab in labs" :key="lab.laboratorioId">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-xs font-medium text-ink">{{ lab.nombre }}</span>
        <span class="text-xs font-semibold text-faint">{{ lab.porcentaje }}%</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-subtle">
        <div
          class="h-full rounded-full bg-primary transition-all duration-500"
          :style="{ width: `${lab.porcentaje}%` }"
        />
      </div>
    </div>
  </div>
</template>
