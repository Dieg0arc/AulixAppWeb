<script setup lang="ts">
import { Plus, Search, Package, AlertTriangle, Wrench } from 'lucide-vue-next'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import PrestamoFila from '~/features/auxiliar/components/PrestamoFila.vue'
import { useEquiposStats } from '~/features/auxiliar/composables/useEquipos'
import { usePrestamos } from '~/features/auxiliar/composables/usePrestamos'

definePageMeta({ layout: 'auxiliar' })

const auth = useAuthStore()
const router = useRouter()

const nombre = computed(() => auth.nombre.split(' ')[0] ?? auth.nombre)

const { data: stats } = useEquiposStats()
const { data: prestamos, isPending } = usePrestamos()

const prestadosAhora = computed(
  () => prestamos.value?.filter((p) => p.estado === 'activo').length ?? 0,
)
const recientes = computed(() => prestamos.value?.slice(0, 4) ?? [])

const busqueda = ref('')
function irABuscar() {
  const q = busqueda.value.trim()
  router.push(q ? `/auxiliar/prestamo/buscar?q=${encodeURIComponent(q)}` : '/auxiliar/prestamo/buscar')
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <!-- Encabezado -->
    <header>
      <p class="text-xs font-semibold tracking-wide text-faint">AUXILIAR · LAB-B-204</p>
      <h1 class="mt-1 text-3xl font-bold text-ink">
        Hola, {{ nombre }} —
        <span class="text-primary">{{ prestadosAhora }} prestado{{ prestadosAhora !== 1 ? 's' : '' }} ahora</span>
      </h1>
    </header>

    <!-- Buscador + acción principal -->
    <AppCard>
      <p class="mb-3 text-sm font-semibold text-ink">Nuevo préstamo</p>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar equipo por nombre o serie…"
            class="w-full rounded-lg border border-default bg-canvas py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none"
            @keydown.enter="irABuscar"
          />
        </div>
        <AppButton @click="irABuscar">
          <Plus class="h-4 w-4" />
          Buscar equipo
        </AppButton>
      </div>
    </AppCard>

    <!-- 3 stats de estado de equipos -->
    <div class="grid grid-cols-3 gap-4">
      <AppCard>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-ok/10">
            <Package class="h-5 w-5 text-ok" />
          </div>
          <div>
            <p class="text-2xl font-bold text-ink">{{ stats?.disponibles ?? '—' }}</p>
            <p class="text-xs text-faint">Disponibles</p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-warn/10">
            <Package class="h-5 w-5 text-warn" />
          </div>
          <div>
            <p class="text-2xl font-bold text-ink">{{ stats?.prestados ?? '—' }}</p>
            <p class="text-xs text-faint">Prestados</p>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
            <Wrench class="h-5 w-5 text-danger" />
          </div>
          <div>
            <p class="text-2xl font-bold text-ink">{{ stats?.reparacion ?? '—' }}</p>
            <p class="text-xs text-faint">En reparación</p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Historial reciente -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-ink">Historial reciente</h2>
        <NuxtLink to="/auxiliar/historial" class="text-sm font-medium text-primary hover:underline">
          Ver todo →
        </NuxtLink>
      </div>

      <div v-if="isPending" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-subtle" />
      </div>

      <div v-else-if="recientes.length === 0" class="rounded-xl border border-default bg-surface p-6 text-center text-sm text-faint">
        No hay préstamos registrados aún.
      </div>

      <div v-else class="space-y-2">
        <PrestamoFila
          v-for="p in recientes"
          :key="p.id"
          :prestamo="p"
        />
      </div>
    </section>
  </div>
</template>
