<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ROLE_LABEL } from '~/lib/constants/roles'

const auth = useAuthStore()
const router = useRouter()

const iniciales = computed(() => {
  const partes = auth.nombre.trim().split(/\s+/)
  if (partes.length === 0 || partes[0] === '') return '?'
  const primera = partes[0][0] ?? ''
  const segunda = partes.length > 1 ? (partes[1][0] ?? '') : ''
  return (primera + segunda).toUpperCase()
})

function cerrarSesion() {
  auth.clear()
  router.push('/login')
}
</script>

<template>
  <div class="border-t border-default px-4 py-4 space-y-3">
    <div class="flex items-center gap-3">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary"
      >
        {{ iniciales }}
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-ink">{{ auth.nombre }}</p>
        <p class="truncate text-xs text-faint">{{ ROLE_LABEL[auth.rol ?? 'docente'] }}</p>
      </div>
    </div>

    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-lg border border-default px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-subtle"
      @click="cerrarSesion"
    >
      <LogOut class="h-4 w-4" />
      Cerrar sesión
    </button>
  </div>
</template>
