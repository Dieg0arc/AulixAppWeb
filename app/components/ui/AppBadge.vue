<script setup lang="ts">
/**
 * Etiqueta de estado de Aulix.
 * Usada para estados de sesión, incidencia, préstamo.
 */
type Tone = 'ok' | 'warn' | 'danger' | 'neutral' | 'info'

withDefaults(defineProps<{
  tone?: Tone
}>(), {
  tone: 'neutral',
})

const toneClasses: Record<Tone, string> = {
  ok: 'bg-ok/10 text-ok',
  warn: 'bg-warn/10 text-warn',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-arena text-muted',
  info: 'bg-cielo text-cobalto',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      toneClasses[tone],
    ]"
  >
    <slot />
  </span>
</template>
