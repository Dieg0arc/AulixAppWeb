<script setup lang="ts">
import { CheckCircle2, QrCode, Hash, Home } from 'lucide-vue-next'
import type { ComprobanteAsistencia } from '~/features/estudiante/api/sesionAbierta.mock'

definePageMeta({ layout: 'estudiante' })

const router = useRouter()

// El comprobante se almacenó en useState por useRegistrarAsistencia antes de navegar aquí.
const comprobante = useState<ComprobanteAsistencia | null>('estudiante:comprobante')

// Guard de F5: si no hay comprobante en memoria, volver al home.
onMounted(() => {
  if (!comprobante.value) router.replace('/estudiante')
})

const METODO_LABEL = { qr: 'QR', codigo: 'Código numérico' } as const

function volver() {
  comprobante.value = null
  router.push('/estudiante')
}
</script>

<template>
  <div v-if="comprobante" class="mx-auto max-w-sm space-y-6">
    <!-- Ícono de éxito -->
    <div class="flex flex-col items-center gap-3 pt-4 text-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-ok/10">
        <CheckCircle2 class="h-10 w-10 text-ok" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-ink">¡Asistencia registrada!</h1>
        <p class="mt-1 text-sm text-faint">Tu presencia quedó confirmada.</p>
      </div>
    </div>

    <!-- Tarjeta comprobante -->
    <div class="rounded-2xl border border-default bg-surface overflow-hidden">
      <!-- Cabecera -->
      <div class="px-5 py-3" style="background-color: #0891B2;">
        <p class="text-xs font-bold tracking-widest text-white">COMPROBANTE DE ASISTENCIA</p>
        <p class="mt-0.5 font-mono text-sm text-white/80">#{{ comprobante.id }}</p>
      </div>

      <!-- Campos -->
      <dl class="divide-y divide-default">
        <div class="flex items-start gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">PRÁCTICA</dt>
          <dd class="font-medium text-ink">{{ comprobante.practica }}</dd>
        </div>
        <div class="flex items-start gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">ASIGNATURA</dt>
          <dd class="text-ink">{{ comprobante.asignatura }}</dd>
        </div>
        <div class="flex items-start gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">LABORATORIO</dt>
          <dd class="text-ink">{{ comprobante.laboratorio }}</dd>
        </div>
        <div class="flex items-start gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">FECHA</dt>
          <dd class="text-ink">{{ comprobante.fecha }}</dd>
        </div>
        <div class="flex items-start gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">HORA</dt>
          <dd class="text-ink">{{ comprobante.hora }}</dd>
        </div>
        <div class="flex items-center gap-3 px-5 py-3.5">
          <dt class="w-28 shrink-0 text-xs font-semibold tracking-wide text-faint">MÉTODO</dt>
          <dd class="flex items-center gap-2 text-ink">
            <QrCode v-if="comprobante.metodo === 'qr'" class="h-4 w-4 text-faint" />
            <Hash v-else class="h-4 w-4 text-faint" />
            {{ METODO_LABEL[comprobante.metodo] }}
          </dd>
        </div>
      </dl>
    </div>

    <button
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
      style="background-color: #0891B2;"
      @click="volver"
    >
      <Home class="h-5 w-5" />
      Ir a Mis prácticas
    </button>
  </div>
</template>
