<script setup lang="ts">
import ProximaSesionCard from '~/features/docente/components/ProximaSesionCard.vue'
import AccesosRapidos from '~/features/docente/components/AccesosRapidos.vue'
import { useMiDia } from '~/features/docente/composables/useMiDia'

definePageMeta({
  layout: 'docente',
})

const auth = useAuthStore()
const router = useRouter()

const { data: sesiones, isPending, isError } = useMiDia()

const proxima = computed(() => sesiones.value?.[0] ?? null)

const saludo = computed(() => {
  const n = sesiones.value?.length ?? 0
  const cuenta =
    n === 0
      ? 'No tienes prácticas programadas hoy.'
      : `Tienes ${n} práctica${n > 1 ? 's' : ''} programada${n > 1 ? 's' : ''} hoy.`
  return `Buenos días, ${auth.nombre.split(' ')[0]} — ${cuenta}`
})

function onAbrirSesion() {
  if (proxima.value) router.push(`/docente/sesion/${proxima.value.id}`)
}

function onAcceso(evento: string) {
  // Los destinos reales se conectan cuando existan esas rutas (sub-pasos siguientes).
  console.log('Acceso rápido:', evento)
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-ink">Mi día</h1>
      <p class="mt-2 text-faint">{{ saludo }}</p>
    </header>

    <!-- Estado de carga -->
    <div
      v-if="isPending"
      class="h-64 animate-pulse rounded-3xl bg-subtle"
    />

    <!-- Error -->
    <div
      v-else-if="isError"
      class="rounded-2xl border border-default bg-surface p-6 text-faint"
    >
      No se pudieron cargar tus sesiones. Intenta recargar.
    </div>

    <!-- Sin sesiones -->
    <div
      v-else-if="!proxima"
      class="rounded-2xl border border-default bg-surface p-6 text-faint"
    >
      No tienes ninguna práctica programada para hoy.
    </div>

    <!-- Próxima sesión -->
    <ProximaSesionCard
      v-else
      :sesion="proxima"
      @abrir="onAbrirSesion"
    />

    <AccesosRapidos @seleccionar="onAcceso" />
  </div>
</template>
