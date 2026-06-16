<script setup lang="ts">
import AppSidebar from '~/components/shared/AppSidebar.vue'
import AppTopbar from '~/components/shared/AppTopbar.vue'
import { NAV_ITEMS } from '~/lib/constants/nav'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-canvas">
    <AppSidebar :items="NAV_ITEMS.auxiliar" />

    <div class="flex flex-1 flex-col overflow-hidden">
      <AppTopbar />
      <main class="flex-1 overflow-y-auto px-8 py-8">
        <slot />
      </main>
    </div>
  </div>
</template>
