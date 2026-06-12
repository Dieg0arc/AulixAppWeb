<script setup lang="ts">
/**
 * Contenedor de superficie de Aulix.
 * Fondo blanco sobre el Lienzo, borde sutil, sombra ligera.
 * Envuelve casi todo el contenido de los dashboards.
 */
withDefaults(defineProps<{
  padded?: boolean
}>(), {
  padded: true,
})
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-arena bg-surface shadow-sm',
      padded ? 'p-5' : '',
    ]"
  >
    <slot />
  </div>
</template>
