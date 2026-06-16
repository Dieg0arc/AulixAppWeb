<script setup lang="ts">
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import EstadoBadge from '~/components/shared/EstadoBadge.vue'
import PrestamoFila from '~/features/auxiliar/components/PrestamoFila.vue'
import { usePrestamos } from '~/features/auxiliar/composables/usePrestamos'
import { useDevolucion } from '~/features/auxiliar/composables/useDevolucion'

definePageMeta({ layout: 'auxiliar' })

const router = useRouter()

const estadoFiltro = ref<'activo' | undefined>('activo')
const { data: activos, isPending } = usePrestamos(estadoFiltro)
const { mutateAsync, isPending: devolviendo } = useDevolucion()

// Etapas: 1 = seleccionar préstamo, 2 = confirmar devolución
const etapa = ref<1 | 2>(1)
const seleccionadoId = ref<string | null>(null)

const seleccionado = computed(
  () => activos.value?.find((p) => p.id === seleccionadoId.value) ?? null,
)

function seleccionar(id: string) {
  seleccionadoId.value = seleccionadoId.value === id ? null : id
}

function irEtapa2() {
  if (!seleccionadoId.value) return
  etapa.value = 2
}

// Etapa 2
type EstadoRecibido = 'buen_estado' | 'con_danos' | 'requiere_mantenimiento'
const estadoRecibido = ref<EstadoRecibido>('buen_estado')
const opcEstado: { key: EstadoRecibido; label: string }[] = [
  { key: 'buen_estado', label: 'Buen estado' },
  { key: 'con_danos', label: 'Con daños' },
  { key: 'requiere_mantenimiento', label: 'Requiere mantenimiento' },
]

type NovedadEstado = 'sin_novedad' | 'con_observaciones'
const novedad = ref<NovedadEstado>('sin_novedad')
const observaciones = ref('')

async function confirmarDevolucion() {
  if (!seleccionadoId.value) return
  await mutateAsync({
    id: seleccionadoId.value,
    estadoEquipo: estadoRecibido.value,
    observaciones: novedad.value === 'con_observaciones' ? observaciones.value : undefined,
  })
  router.push('/auxiliar')
}

const duracionLabel = computed(() => {
  if (!seleccionado.value) return ''
  const inicio = new Date(seleccionado.value.fechaPrestamo).getTime()
  const mins = Math.round((Date.now() - inicio) / 60_000)
  const h = Math.floor(mins / 60); const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Encabezado con progreso -->
    <div>
      <button
        type="button"
        class="flex items-center gap-2 text-sm font-medium text-primary"
        @click="etapa === 2 ? (etapa = 1) : router.back()"
      >
        ← {{ etapa === 2 ? 'Volver a selección' : 'Volver' }}
      </button>

      <p class="mt-4 text-xs font-semibold tracking-wide text-faint">
        DEVOLUCIÓN · PASO {{ etapa }} DE 2
      </p>
      <h1 class="mt-1 text-3xl font-bold text-ink">
        {{ etapa === 1 ? 'Seleccionar préstamo' : 'Confirmar devolución' }}
      </h1>

      <!-- Barra de progreso -->
      <div class="mt-4 flex gap-2">
        <div
          v-for="n in 2"
          :key="n"
          class="h-1.5 flex-1 rounded-full transition-colors"
          :class="n <= etapa ? 'bg-primary' : 'bg-subtle'"
        />
      </div>
    </div>

    <!-- ── ETAPA 1: seleccionar préstamo activo ── -->
    <template v-if="etapa === 1">
      <div v-if="isPending" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-subtle" />
      </div>

      <div
        v-else-if="!activos?.length"
        class="rounded-xl border border-default bg-surface p-8 text-center text-sm text-faint"
      >
        No hay préstamos activos en este momento.
      </div>

      <div v-else class="space-y-2">
        <PrestamoFila
          v-for="p in activos"
          :key="p.id"
          :prestamo="p"
          :seleccionable="true"
          :seleccionado="seleccionadoId === p.id"
          @seleccionar="seleccionar"
        />
      </div>

      <AppButton
        size="lg"
        class="w-full"
        :disabled="!seleccionado"
        @click="irEtapa2"
      >
        Continuar
      </AppButton>
    </template>

    <!-- ── ETAPA 2: confirmar devolución ── -->
    <template v-else-if="etapa === 2 && seleccionado">
      <!-- Resumen del préstamo -->
      <AppCard>
        <p class="mb-3 text-xs font-semibold tracking-wide text-faint">PRÉSTAMO SELECCIONADO</p>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-ink">{{ seleccionado.equipo.nombre }}</p>
            <EstadoBadge label="ACTIVO" tono="warn" :punto="true" />
          </div>
          <p class="text-xs text-faint">{{ seleccionado.equipo.numeroSerie }}</p>
          <p class="text-xs text-faint">
            Solicitante: {{ seleccionado.solicitante.nombre }} · {{ seleccionado.solicitante.programa }}
          </p>
          <p class="text-xs text-faint">Duración hasta ahora: {{ duracionLabel }}</p>
        </div>
      </AppCard>

      <!-- Estado al recibir -->
      <div>
        <p class="mb-2 text-xs font-semibold tracking-wide text-faint">ESTADO AL RECIBIR</p>
        <div class="space-y-2">
          <label
            v-for="op in opcEstado"
            :key="op.key"
            class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
            :class="
              estadoRecibido === op.key
                ? 'border-primary bg-accent-soft'
                : 'border-default bg-surface hover:bg-subtle'
            "
          >
            <input
              type="radio"
              :value="op.key"
              v-model="estadoRecibido"
              class="accent-primary"
            />
            <span class="text-sm font-medium text-ink">{{ op.label }}</span>
          </label>
        </div>
      </div>

      <!-- Novedad -->
      <div>
        <p class="mb-2 text-xs font-semibold tracking-wide text-faint">OBSERVACIONES</p>
        <div class="flex gap-2">
          <button
            v-for="op in [
              { key: 'sin_novedad', label: 'Sin novedad' },
              { key: 'con_observaciones', label: 'Con observaciones' },
            ]"
            :key="op.key"
            type="button"
            class="flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors"
            :class="
              novedad === op.key
                ? 'border-primary bg-accent-soft text-primary'
                : 'border-default bg-surface text-ink hover:bg-subtle'
            "
            @click="novedad = op.key as typeof novedad"
          >
            {{ op.label }}
          </button>
        </div>

        <textarea
          v-if="novedad === 'con_observaciones'"
          v-model="observaciones"
          rows="3"
          maxlength="400"
          class="mt-3 w-full rounded-xl border border-default bg-surface p-4 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none"
          placeholder="Describe el estado del equipo al momento de la devolución…"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <AppButton variant="secondary" size="lg" @click="etapa = 1">Cancelar</AppButton>
        <AppButton size="lg" :loading="devolviendo" @click="confirmarDevolucion">
          Confirmar devolución
        </AppButton>
      </div>
    </template>
  </div>
</template>
