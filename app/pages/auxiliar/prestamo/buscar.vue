<script setup lang="ts">
import { Search, ScanLine } from 'lucide-vue-next'
import AppButton from '~/components/ui/AppButton.vue'
import EquipoFila from '~/features/auxiliar/components/EquipoFila.vue'
import { useBuscarEquipo } from '~/features/auxiliar/composables/useBuscarEquipo'

definePageMeta({ layout: 'auxiliar' })

const router = useRouter()
const route = useRoute()

// Inicializa con ?q= si viene del buscador del index
const q = ref((route.query.q as string) ?? '')
const inputRef = ref<HTMLInputElement | null>(null)

const { data: resultados, isPending } = useBuscarEquipo(q)

type Chip = 'todos' | 'disponibles' | 'mi-lab' | 'hoy'
const chipActivo = ref<Chip>('todos')
const chips: { key: Chip; label: string }[] = [
  { key: 'todos', label: 'Más buscados' },
  { key: 'disponibles', label: 'Disponibles' },
  { key: 'mi-lab', label: 'Mi lab' },
  { key: 'hoy', label: 'Hoy' },
]

const filtrados = computed(() => {
  const base = resultados.value ?? []
  if (chipActivo.value === 'disponibles') return base.filter((e) => e.estado === 'disponible')
  // 'mi-lab', 'hoy', 'todos' → mismos datos en mock; backend filtrará por criterio real
  return base
})

const countDisponibles = computed(
  () => filtrados.value.filter((e) => e.estado === 'disponible').length,
)

const seleccionadoId = ref<string | null>(null)
const seleccionado = computed(() =>
  filtrados.value.find((e) => e.id === seleccionadoId.value) ?? null,
)

function toggleSeleccion(id: string) {
  const equipo = filtrados.value.find((e) => e.id === id)
  if (!equipo || equipo.estado !== 'disponible') return
  seleccionadoId.value = seleccionadoId.value === id ? null : id
}

function continuar() {
  if (!seleccionadoId.value) return
  router.push(`/auxiliar/prestamo/registrar?equipoId=${seleccionadoId.value}`)
}

function vencimientoLabel(iso: string | null): string | undefined {
  if (!iso) return undefined
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function desdeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }).toLowerCase()
}

onMounted(() => inputRef.value?.focus())
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <!-- Volver -->
    <button
      type="button"
      class="flex items-center gap-2 text-sm font-medium text-primary"
      @click="router.back()"
    >
      ← Volver
    </button>

    <h1 class="text-3xl font-bold text-ink">Buscar equipo</h1>

    <!-- Input + escaner placeholder -->
    <div class="flex gap-2">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          ref="inputRef"
          v-model="q"
          type="text"
          placeholder="Nombre, serie o tipo…"
          class="w-full rounded-xl border border-default bg-surface py-3 pl-9 pr-4 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none"
        />
      </div>
      <!-- TODO: escaneo QR → placeholder, requiere HTTPS + getUserMedia -->
      <button
        type="button"
        title="Escanear código (próximamente)"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-default bg-surface text-faint transition-colors hover:bg-subtle"
        disabled
      >
        <ScanLine class="h-5 w-5" />
      </button>
    </div>

    <!-- Chips de filtro -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="chip in chips"
        :key="chip.key"
        type="button"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          chipActivo === chip.key
            ? 'bg-primary text-on-primary'
            : 'bg-subtle text-ink hover:bg-accent-soft'
        "
        @click="chipActivo = chip.key"
      >
        {{ chip.label }}
      </button>
    </div>

    <!-- Contador resultados -->
    <div v-if="!isPending" class="flex items-center gap-2 text-xs font-semibold tracking-wide text-faint">
      <span>{{ filtrados.length }} RESULTADO{{ filtrados.length !== 1 ? 'S' : '' }}</span>
      <span class="text-border-default">·</span>
      <span class="text-ok">{{ countDisponibles }} DISPONIBLE{{ countDisponibles !== 1 ? 'S' : '' }}</span>
    </div>

    <!-- Lista de equipos -->
    <div v-if="isPending" class="space-y-2">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-xl bg-subtle" />
    </div>

    <div v-else class="space-y-2">
      <EquipoFila
        v-for="equipo in filtrados"
        :key="equipo.id"
        :equipo="equipo"
        :seleccionado="seleccionadoId === equipo.id"
        :vencimiento="equipo.estado === 'prestado' ? vencimientoLabel(null) : undefined"
        :desde-label="equipo.estado === 'reparacion' ? desdeLabel(new Date(Date.now() - 1000*60*60*24*5).toISOString()) : undefined"
        @seleccionar="toggleSeleccion"
      />
    </div>

    <!-- Botón continuar -->
    <div class="sticky bottom-0 pt-4">
      <AppButton
        size="lg"
        class="w-full"
        :disabled="!seleccionado"
        @click="continuar"
      >
        Continuar al préstamo
        <span v-if="seleccionado"> — {{ seleccionado.nombre }}</span>
      </AppButton>
    </div>
  </div>
</template>
