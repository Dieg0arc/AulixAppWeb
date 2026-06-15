<script setup lang="ts">
import { Sun, Moon, Bell } from 'lucide-vue-next'

const { isDark, toggle } = useTheme()

const fecha = computed(() =>
  new Date()
    .toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
    .replace(/\./g, ''),
)
</script>

<template>
  <header
    class="flex items-center justify-between border-b border-default px-8 py-5"
  >
    <p class="text-sm font-semibold tracking-wide text-faint">{{ fecha }}</p>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-default text-ink transition-colors hover:bg-subtle"
        :aria-label="isDark ? 'Activar tema claro' : 'Activar tema oscuro'"
        @click="toggle"
      >
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>

      <button
        type="button"
        class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-default text-ink transition-colors hover:bg-subtle"
        aria-label="Notificaciones"
      >
        <Bell class="h-5 w-5" />
        <span
          class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-cobre"
        />
      </button>
    </div>
  </header>
</template>
