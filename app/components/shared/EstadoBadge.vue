<script setup lang="ts">
type Tono = 'ok' | 'info' | 'warn' | 'danger' | 'neutral'

const props = defineProps<{
  label: string
  tono: Tono
  punto?: boolean
}>()

const clases: Record<Tono, string> = {
  ok: 'bg-ok/10 text-ok',
  info: 'bg-primary/10 text-primary',
  warn: 'bg-warn/10 text-warn',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-subtle text-faint',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="clases[props.tono]"
  >
    <span v-if="punto" class="h-1.5 w-1.5 rounded-full bg-current" />
    {{ label }}
  </span>
</template>
