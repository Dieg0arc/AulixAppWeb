<script setup lang="ts">
import type { NavItem } from '~/lib/constants/nav'
import UserMenu from './UserMenu.vue'

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()

function esActiva(to: string): boolean {
  // exacta para la home del rol; prefijo para las subrutas
  return route.path === to || (to !== '/' && route.path.startsWith(`${to}/`))
}
</script>

<template>
  <aside class="flex h-full w-64 shrink-0 flex-col border-r border-default bg-surface">
    <div class="flex items-center gap-3 px-6 py-6">
      <div class="h-8 w-8 rotate-45 rounded-md bg-primary" />
      <div class="-space-y-0.5">
        <p class="text-lg font-bold leading-none text-ink">Aulix</p>
        <p class="text-xs font-medium tracking-wide text-faint">DOCENTE</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          esActiva(item.to)
            ? 'bg-accent-soft text-primary'
            : 'text-ink hover:bg-subtle'
        "
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <UserMenu />
  </aside>
</template>
