<script setup lang="ts">
import { ref, computed } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useCierre } from '~/features/docente/composables/useCierre'
import { useCronometro } from '~/composables/useTiempoRestante'
import type { EstadoFinal } from '~/features/docente/api/cierre.mock'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data } = useCierre(id)

// Duración total: cronómetro desde la apertura.
const duracion = ref('00:00:00')
watch(data, (d) => {
  if (d) {
    const { formato } = useCronometro(new Date(d.horaAperturaIso))
    watchEffect(() => { duracion.value = formato.value })
  }
}, { immediate: true })

const OPCIONES: { valor: EstadoFinal; titulo: string; sub: string }[] = [
  { valor: 'normal', titulo: 'Normal', sub: 'Práctica completada sin novedad' },
  { valor: 'incidencia', titulo: 'Con incidencia', sub: 'Hubo un evento reportado' },
  { valor: 'cancelada', titulo: 'Cancelada', sub: 'No se pudo completar' },
]

const estadoFinal = ref<EstadoFinal>('normal')
const observaciones = ref('')

// Las observaciones son requeridas si el estado no es "normal".
const requiereObs = computed(() => estadoFinal.value !== 'normal')
const obsValida = computed(() => !requiereObs.value || observaciones.value.trim().length > 0)

const enviando = ref(false)
async function cerrar() {
  if (!obsValida.value) return
  enviando.value = true
  // TODO(backend): POST /docente/sesiones/:id/cerrar { estadoFinal, observaciones }
  await new Promise((r) => setTimeout(r, 600))
  enviando.value = false
  router.push('/docente')
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.back()">
      ← Volver
    </button>

    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">HU 03</p>
    <h1 class="mt-2 text-3xl font-bold text-ink">Cerrar sesión</h1>

    <template v-if="data">
      <!-- Duración -->
      <div class="mt-6 rounded-2xl border border-default bg-surface p-6">
        <p class="text-xs font-semibold tracking-wide text-faint">
          DURACIÓN · {{ data.horaApertura }} → {{ data.horaFin }}
        </p>
        <p class="mt-2 text-4xl font-bold tabular-nums text-ink">{{ duracion }}</p>
      </div>

      <!-- Métricas -->
      <div class="mt-4 grid grid-cols-3 gap-3">
        <div class="rounded-2xl border border-default bg-surface p-5 text-center">
          <p class="text-2xl font-bold text-ok">{{ data.asistencia.confirmados }}/{{ data.asistencia.total }}</p>
          <p class="mt-1 text-sm text-faint">Asistencia</p>
        </div>
        <div class="rounded-2xl border border-default bg-surface p-5 text-center">
          <p class="text-2xl font-bold text-cobre">{{ data.incidencias }}</p>
          <p class="mt-1 text-sm text-faint">Incidencia</p>
        </div>
        <div class="rounded-2xl border border-default bg-surface p-5 text-center">
          <p class="text-2xl font-bold text-ink">{{ data.evidencias }}</p>
          <p class="mt-1 text-sm text-faint">Evidencias</p>
        </div>
      </div>

      <!-- Estado final -->
      <p class="mt-8 text-xs font-semibold tracking-wide text-faint">ESTADO FINAL</p>
      <div class="mt-3 space-y-3">
        <button
          v-for="op in OPCIONES"
          :key="op.valor"
          type="button"
          class="flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors"
          :class="estadoFinal === op.valor
            ? 'border-warn bg-warn/10'
            : 'border-default bg-surface hover:bg-subtle'"
          @click="estadoFinal = op.valor"
        >
          <span
            class="flex h-5 w-5 items-center justify-center rounded-full border-2"
            :class="estadoFinal === op.valor ? 'border-warn' : 'border-default'"
          >
            <span v-if="estadoFinal === op.valor" class="h-2.5 w-2.5 rounded-full bg-warn" />
          </span>
          <span>
            <span class="block font-semibold text-ink">{{ op.titulo }}</span>
            <span class="block text-sm text-faint">{{ op.sub }}</span>
          </span>
        </button>
      </div>

      <!-- Observaciones -->
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold tracking-wide text-faint">OBSERVACIONES DE CIERRE</label>
          <span
            class="rounded-md px-2 py-0.5 text-xs font-semibold"
            :class="requiereObs ? 'bg-danger/10 text-danger' : 'bg-subtle text-faint'"
          >
            {{ requiereObs ? 'Requerido' : 'Opcional' }}
          </span>
        </div>
        <textarea
          v-model="observaciones"
          rows="3"
          class="mt-2 w-full rounded-xl border bg-surface p-4 text-ink placeholder:text-faint focus:outline-none"
          :class="!obsValida ? 'border-danger focus:border-danger' : 'border-default focus:border-primary'"
          placeholder="Describe el cierre de la sesión…"
        />
        <p v-if="!obsValida" class="mt-1 text-xs text-danger">
          Las observaciones son obligatorias para este estado.
        </p>
      </div>

      <AppButton size="lg" class="mt-6 w-full" :disabled="!obsValida" :loading="enviando" @click="cerrar">
        ✓ Cerrar sesión
      </AppButton>
    </template>
  </div>
</template>
