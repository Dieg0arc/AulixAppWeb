<script setup lang="ts">
import { QrCode, Clock, AlertTriangle, Camera } from 'lucide-vue-next'
import { useSesionCurso } from '~/features/docente/composables/useSesionCurso'
import { useCronometro } from '~/composables/useTiempoRestante'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data, isPending, isError } = useSesionCurso(id)

// El cronómetro arranca cuando llega la hora de apertura del mock.
const cronometro = ref<{ formato: { value: string } } | null>(null)
const tiempo = ref('00:00:00')
watch(data, (d) => {
  if (d && !cronometro.value) {
    const { formato } = useCronometro(new Date(d.horaApertura))
    watchEffect(() => { tiempo.value = formato.value })
    cronometro.value = { formato }
  }
}, { immediate: true })

interface Accion {
  label: string
  sub: string
  icono: typeof QrCode
  to: string
  tono: 'primary' | 'cobre'
}
const acciones = computed<Accion[]>(() => [
  { label: 'QR de asistencia', sub: data.value ? `En vivo · ${data.value.asistencia.confirmados}/${data.value.asistencia.total}` : 'En vivo', icono: QrCode, to: `/docente/sesion/${id}/qr`, tono: 'primary' },
  { label: 'Código de tiempo', sub: 'Alternativa al QR', icono: Clock, to: `/docente/sesion/${id}/codigo`, tono: 'primary' },
  { label: 'Reportar incidencia', sub: 'Equipo, seguridad…', icono: AlertTriangle, to: `/docente/sesion/${id}/incidencia`, tono: 'cobre' },
  { label: 'Evidencias', sub: data.value ? `${data.value.evidencias} capturas` : '', icono: Camera, to: `/docente/sesion/${id}/evidencias`, tono: 'primary' },
])
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.push('/docente')">
      ← Volver
    </button>

    <div v-if="isPending" class="mt-6 h-96 animate-pulse rounded-2xl bg-subtle" />
    <p v-else-if="isError" class="mt-6 text-faint">No se pudo cargar la sesión.</p>

    <template v-else-if="data">
      <div class="mt-6 flex items-start justify-between">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full bg-ok/10 px-3 py-1 text-sm font-semibold text-ok">
            <span class="h-1.5 w-1.5 rounded-full bg-ok" /> EN VIVO
          </span>
          <h1 class="mt-3 text-3xl font-bold text-ink">Sesión en curso</h1>
          <p class="mt-1 text-faint">{{ data.practica }} · {{ data.laboratorio }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold tracking-wide text-faint">TRANSCURRIDO</p>
          <p class="mt-1 text-3xl font-bold tabular-nums text-ink">{{ tiempo }}</p>
        </div>
      </div>

      <p class="mt-8 text-xs font-semibold tracking-wide text-faint">ACCIONES</p>
      <div class="mt-3 grid grid-cols-2 gap-4">
        <button
          v-for="a in acciones"
          :key="a.label"
          type="button"
          class="rounded-2xl border border-default bg-surface p-6 text-left transition-colors hover:bg-subtle"
          @click="router.push(a.to)"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="a.tono === 'cobre' ? 'bg-cobre/10 text-cobre' : 'bg-accent-soft text-primary'"
          >
            <component :is="a.icono" class="h-6 w-6" />
          </div>
          <p class="mt-4 text-lg font-bold text-ink">{{ a.label }}</p>
          <p class="mt-1 text-sm text-faint">{{ a.sub }}</p>
        </button>
      </div>

      <button
        type="button"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-danger py-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
        @click="router.push(`/docente/sesion/${id}/cerrar`)"
      >
        ✕ Cerrar sesión
      </button>
    </template>
  </div>
</template>
