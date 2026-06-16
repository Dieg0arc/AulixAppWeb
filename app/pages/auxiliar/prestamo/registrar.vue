<script setup lang="ts">
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import EstadoBadge from '~/components/shared/EstadoBadge.vue'
import DestinatarioCard from '~/features/auxiliar/components/DestinatarioCard.vue'
import { useRegistrarPrestamo } from '~/features/auxiliar/composables/useRegistrarPrestamo'
import { EQUIPOS_MOCK } from '~/features/auxiliar/api/equipos.mock'
import { SOLICITANTES_MOCK } from '~/features/auxiliar/api/prestamos.mock'

definePageMeta({ layout: 'auxiliar' })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const equipoId = route.query.equipoId as string
const equipo = EQUIPOS_MOCK.find((e) => e.id === equipoId)

if (!equipo) {
  router.replace('/auxiliar/prestamo/buscar')
}

// Destinatario por defecto (mock); "Cambiar" cicla entre solicitantes demo
const destinatarioIdx = ref(0)
const destinatario = computed(() => SOLICITANTES_MOCK[destinatarioIdx.value]!)
function cambiarDestinatario() {
  destinatarioIdx.value = (destinatarioIdx.value + 1) % SOLICITANTES_MOCK.length
}

// Duración
type DuracionChip = '1h' | '2h' | '4h' | 'cierre'
const duracionSeleccionada = ref<DuracionChip>('2h')
const DURACION_CHIPS: { key: DuracionChip; label: string; minutos: number }[] = [
  { key: '1h', label: '1 hora', minutos: 60 },
  { key: '2h', label: '2 horas', minutos: 120 },
  { key: '4h', label: '4 horas', minutos: 240 },
  { key: 'cierre', label: 'Cierre del día', minutos: 0 }, // minutos=0 → hasta las 18:00
]

const ahora = new Date()

const devolucionDate = computed<Date>(() => {
  if (duracionSeleccionada.value === 'cierre') {
    const d = new Date(ahora)
    d.setHours(18, 0, 0, 0)
    return d
  }
  const chip = DURACION_CHIPS.find((c) => c.key === duracionSeleccionada.value)!
  return new Date(ahora.getTime() + chip.minutos * 60_000)
})

const horaEntrega = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })

const horaDevolucion = computed(() =>
  devolucionDate.value.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
)

const duracionLabel = computed(() => {
  const diffMin = Math.round((devolucionDate.value.getTime() - ahora.getTime()) / 60_000)
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
})

// Observaciones
type NovedadEstado = 'sin_novedad' | 'con_observaciones'
const novedad = ref<NovedadEstado>('sin_novedad')
const observaciones = ref('')
const MAX_OBS = 400

// Registrar
const { mutateAsync, isPending: registrando } = useRegistrarPrestamo()

async function confirmar() {
  await mutateAsync({
    equipoId: equipoId,
    solicitanteId: destinatario.value.id,
    fechaDevolucion: devolucionDate.value.toISOString(),
    observaciones: novedad.value === 'con_observaciones' ? observaciones.value : undefined,
  })
  router.push('/auxiliar')
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <button
      type="button"
      class="flex items-center gap-2 text-sm font-medium text-primary"
      @click="router.back()"
    >
      ← Volver
    </button>

    <h1 class="text-3xl font-bold text-ink">Registrar préstamo</h1>

    <!-- Equipo seleccionado -->
    <AppCard v-if="equipo">
      <p class="mb-2 text-xs font-semibold tracking-wide text-faint">EQUIPO</p>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-ink">{{ equipo.nombre }}</p>
          <p class="text-xs text-faint">{{ equipo.numeroSerie }} · {{ equipo.tipo }}</p>
        </div>
        <EstadoBadge label="DISPONIBLE" tono="ok" :punto="true" />
      </div>
    </AppCard>

    <!-- Destinatario (solicitante) -->
    <div>
      <p class="mb-2 text-xs font-semibold tracking-wide text-faint">DESTINATARIO</p>
      <DestinatarioCard
        :usuario="destinatario"
        :mostrar-cambiar="true"
        @cambiar="cambiarDestinatario"
      />
    </div>

    <!-- Entrega / Devolución -->
    <AppCard>
      <p class="mb-3 text-xs font-semibold tracking-wide text-faint">ENTREGA / DEVOLUCIÓN</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-faint">Entrega</p>
          <p class="text-2xl font-bold text-ink">{{ horaEntrega }}</p>
        </div>
        <div>
          <p class="text-xs text-faint">Devolución</p>
          <p class="text-2xl font-bold text-ink">{{ horaDevolucion }}</p>
          <p class="text-xs text-faint">duración {{ duracionLabel }}</p>
        </div>
      </div>
    </AppCard>

    <!-- Chips duración -->
    <div>
      <p class="mb-2 text-xs font-semibold tracking-wide text-faint">DURACIÓN</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in DURACION_CHIPS"
          :key="chip.key"
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
          :class="
            duracionSeleccionada === chip.key
              ? 'bg-primary text-on-primary'
              : 'bg-subtle text-ink hover:bg-accent-soft'
          "
          @click="duracionSeleccionada = chip.key"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>

    <!-- Responsable (auxiliar logueado, solo lectura) -->
    <AppCard>
      <p class="mb-2 text-xs font-semibold tracking-wide text-faint">RESPONSABLE</p>
      <p class="font-medium text-ink">{{ auth.nombre }}</p>
      <p class="text-xs text-faint">Auxiliar · LAB-B-204</p>
    </AppCard>

    <!-- Estado al entregar -->
    <div>
      <p class="mb-2 text-xs font-semibold tracking-wide text-faint">ESTADO AL ENTREGAR</p>
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
        :maxlength="MAX_OBS"
        rows="3"
        class="mt-3 w-full rounded-xl border border-default bg-surface p-4 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none"
        placeholder="Describe el estado del equipo al momento de la entrega…"
      />
      <p v-if="novedad === 'con_observaciones'" class="mt-1 text-right text-xs text-faint">
        {{ observaciones.length }} / {{ MAX_OBS }}
      </p>
    </div>

    <!-- Confirmar -->
    <AppButton size="lg" class="w-full" :loading="registrando" @click="confirmar">
      Confirmar préstamo
    </AppButton>
  </div>
</template>
