<script setup lang="ts">
import { ROLE_COLOR, ROLE_LABEL, type Role } from '~/lib/constants/roles'

/**
 * Badge que muestra un rol con su color propio.
 * El color viene de ROLE_COLOR (única fuente de verdad).
 */
const props = defineProps<{
  rol: Role
}>()

const color = computed(() => ROLE_COLOR[props.rol])
const label = computed(() => ROLE_LABEL[props.rol])
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
    :style="{ backgroundColor: color }"
  >
    {{ label }}
  </span>
</template>
