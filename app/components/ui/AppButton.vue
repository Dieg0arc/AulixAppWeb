<script setup lang="ts">
/**
 * Botón base de Aulix.
 * Variantes pensadas para los casos de uso reales:
 *  - primary  → acción principal (abrir sesión, registrar asistencia)
 *  - secondary→ acción secundaria (cancelar, volver)
 *  - danger   → acción destructiva (cerrar sesión, eliminar)
 *  - ghost    → acción terciaria, sin fondo
 */
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const variantClasses: Record<Variant, string> = {
  primary: 'bg-cobalto text-white hover:bg-cobalto/90',
  secondary: 'bg-arena text-tinta hover:bg-cielo',
  danger: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'bg-transparent text-cobalto hover:bg-cielo',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-cobalto/40',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
