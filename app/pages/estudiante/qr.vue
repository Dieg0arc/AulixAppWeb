<script setup lang="ts">
import { QrCode, Hash, Image } from 'lucide-vue-next'
import { useSesionAbierta } from '~/features/estudiante/composables/useSesionAbierta'
import { useRegistrarAsistencia } from '~/features/estudiante/composables/useRegistrarAsistencia'

definePageMeta({ layout: 'estudiante' })

const router = useRouter()
const { data: sesionAbierta } = useSesionAbierta()
const { mutateAsync, isPending } = useRegistrarAsistencia()

const detectado = ref(false)
const error = ref('')

// Simulación de detección en dev. Con backend real: getUserMedia + html5-qrcode (requiere HTTPS).
async function simularDeteccion() {
  if (!sesionAbierta.value) return
  detectado.value = true
  error.value = ''
  try {
    await mutateAsync({
      sesionId: sesionAbierta.value.sesionId,
      metodo: 'qr',
      qrData: `AULIX-QR-${sesionAbierta.value.sesionId}`, // valor simulado del QR
    })
    router.push('/estudiante/comprobante')
  } catch {
    detectado.value = false
    error.value = 'No se pudo registrar la asistencia. Intenta de nuevo.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm space-y-6">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.push('/estudiante')">
      ← Volver
    </button>

    <div>
      <p class="text-xs font-semibold tracking-wide text-faint">HU 10 · ESCANEAR QR</p>
      <h1 class="mt-1 text-2xl font-bold text-ink">Escanear QR del docente</h1>
      <p class="mt-1 text-sm text-faint">Encuadra el QR del docente en el recuadro.</p>
    </div>

    <!-- Vista de cámara (placeholder — requiere HTTPS + getUserMedia en producción) -->
    <div class="relative overflow-hidden rounded-2xl border-2 border-default bg-subtle" style="aspect-ratio: 1;">
      <!-- Encuadre de escaneo -->
      <div class="absolute inset-6 rounded-xl border-2 border-dashed" style="border-color: #0891B2;" />
      <!-- Esquinas del marco -->
      <div class="absolute left-6 top-6 h-5 w-5 rounded-tl-lg border-l-4 border-t-4" style="border-color: #0891B2;" />
      <div class="absolute right-6 top-6 h-5 w-5 rounded-tr-lg border-r-4 border-t-4" style="border-color: #0891B2;" />
      <div class="absolute bottom-6 left-6 h-5 w-5 rounded-bl-lg border-b-4 border-l-4" style="border-color: #0891B2;" />
      <div class="absolute bottom-6 right-6 h-5 w-5 rounded-br-lg border-b-4 border-r-4" style="border-color: #0891B2;" />

      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <QrCode class="h-16 w-16 text-faint/40" />
        <p class="text-center text-xs text-faint">
          Cámara no disponible en dev.<br>Usa el botón para simular.
        </p>
      </div>
    </div>

    <!-- Bloque de práctica actual -->
    <div v-if="sesionAbierta" class="rounded-xl border border-default bg-surface px-4 py-3 text-sm">
      <p class="font-semibold text-ink">{{ sesionAbierta.practica }}</p>
      <p class="text-faint">{{ sesionAbierta.asignatura }} · {{ sesionAbierta.laboratorio }}</p>
    </div>
    <div v-else class="rounded-xl border border-default bg-surface px-4 py-3 text-sm text-faint">
      No hay sesión abierta en este momento.
    </div>

    <!-- Error -->
    <p v-if="error" class="rounded-lg bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger">
      {{ error }}
    </p>

    <!-- Botón central de captura (simula detección en dev) -->
    <button
      type="button"
      class="w-full rounded-2xl py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style="background-color: #0891B2;"
      :disabled="isPending || !sesionAbierta"
      @click="simularDeteccion"
    >
      <span v-if="isPending">Registrando…</span>
      <span v-else>{{ detectado ? 'QR detectado ✓' : 'Simular detección' }}</span>
    </button>

    <!-- Accesos alternativos -->
    <div class="flex gap-3">
      <button
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-default py-3 text-sm font-medium text-ink transition-colors hover:bg-subtle"
        @click="router.push('/estudiante/codigo')"
      >
        <Hash class="h-4 w-4" />
        Usar código
      </button>
      <button
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-default py-3 text-sm font-medium text-ink transition-colors hover:bg-subtle"
        disabled
        title="Requiere HTTPS en producción"
      >
        <Image class="h-4 w-4" />
        Foto
      </button>
    </div>
  </div>
</template>
