<script setup lang="ts">
import type { UsuarioResumen } from '../api/prestamos.mock'

defineProps<{
  usuario: UsuarioResumen
  mostrarCambiar?: boolean
}>()

defineEmits<{
  cambiar: []
}>()
</script>

<template>
  <div class="flex items-center gap-4 rounded-xl border border-default bg-surface px-4 py-3">
    <div
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
    >
      {{ usuario.avatarIniciales }}
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-ink">{{ usuario.nombre }}</p>
      <p class="truncate text-xs text-faint">{{ usuario.id }} · {{ usuario.programa }}</p>
    </div>

    <button
      v-if="mostrarCambiar"
      type="button"
      class="shrink-0 text-xs font-medium text-primary hover:underline"
      @click="$emit('cambiar')"
    >
      Cambiar
    </button>
  </div>
</template>
