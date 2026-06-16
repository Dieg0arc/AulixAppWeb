<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import QRCode from 'qrcode'
import { RotateCw, Clock } from 'lucide-vue-next'
import { useAsistenciaEnVivo } from '~/features/docente/composables/useAsistenciaEnVivo'
import { useCuentaRegresiva } from '~/composables/useTiempoRestante'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// QR: se genera sobre un canvas. El payload real lo define el backend
// (token efímero); aquí codifico un valor de sesión + timestamp.
const qrDataUrl = ref('')
async function generarQR() {
  const payload = JSON.stringify({ sesion: id, ts: Date.now() })
  qrDataUrl.value = await QRCode.toDataURL(payload, { width: 320, margin: 1, color: { dark: '#0F2742', light: '#FFFFFF' } })
}

// Countdown de validez del QR (5 min). Al expirar, hay que renovar.
const venceEn = ref(new Date(Date.now() + 5 * 60 * 1000))
const { formato: tiempoQR, expirado } = useCuentaRegresiva(venceEn.value)

// Asistencia en vivo (mock del WS).
const { confirmados, total, feed } = useAsistenciaEnVivo({ totalEsperado: 24, confirmadosIniciales: 18 })

// Solo marcas (no rechazos) para "últimos en escanear".
const ultimos = computed(() => feed.value.filter((f) => f.kind === 'marca').slice(0, 6))

function iniciales(nombre: string) {
  const limpio = nombre.replace(',', '').trim().split(/\s+/)
  return ((limpio[0]?.[0] ?? '') + (limpio[1]?.[0] ?? '')).toUpperCase()
}

// "hace Xs" relativo.
function haceCuanto(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `hace ${s}s`
  return `hace ${Math.floor(s / 60)}m`
}

function renovar() {
  venceEn.value = new Date(Date.now() + 5 * 60 * 1000)
  generarQR()
  // El countdown se recrea al recargar la página; para MVP basta regenerar el QR.
}

onMounted(generarQR)
</script>

<template>
  <div class="mx-auto max-w-xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.push(`/docente/sesion/${id}`)">
      ← Volver
    </button>

    <div class="mt-6 flex items-center justify-between">
      <span class="inline-flex items-center gap-2 rounded-full bg-ok/10 px-3 py-1 text-sm font-semibold text-ok">
        <span class="h-1.5 w-1.5 rounded-full bg-ok" /> EN VIVO
      </span>
      <span class="text-xs font-semibold tracking-wide text-faint">HU 04 · ASISTENCIA POR QR</span>
    </div>

    <h1 class="mt-3 text-center text-3xl font-bold text-ink">Sesión activa</h1>

    <!-- QR -->
    <div class="mt-6 flex justify-center">
      <div class="rounded-3xl bg-white p-4 shadow-sm">
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR de asistencia" class="h-72 w-72" />
        <div v-else class="flex h-72 w-72 items-center justify-center text-faint">Generando…</div>
      </div>
    </div>

    <p class="mt-4 text-center text-lg font-bold tracking-wide" :class="expirado ? 'text-danger' : 'text-cobre'">
      {{ expirado ? 'QR EXPIRADO' : `VENCE EN ${tiempoQR}` }}
    </p>

    <div class="mt-4 flex justify-center gap-3">
      <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-default px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-subtle" @click="renovar">
        <RotateCw class="h-4 w-4" /> Renovar
      </button>
      <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-default px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-subtle" @click="router.push(`/docente/sesion/${id}/codigo`)">
        <Clock class="h-4 w-4" /> Usar código
      </button>
    </div>

    <!-- Contador -->
    <div class="mt-6 flex items-center justify-between rounded-2xl bg-accent-soft px-6 py-5">
      <p class="text-3xl font-bold text-ink">
        {{ confirmados }} <span class="text-lg font-medium text-faint">/{{ total }}</span>
      </p>
      <div class="text-right">
        <p class="font-medium text-ink">Asistentes confirmados</p>
        <p class="text-xs text-faint">en vivo</p>
      </div>
    </div>

    <!-- Últimos en escanear -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">ÚLTIMOS EN ESCANEAR</p>
    <div class="mt-3 space-y-2">
      <TransitionGroup name="feed">
        <div
          v-for="m in ultimos"
          :key="m.timestamp"
          class="flex items-center justify-between rounded-xl border border-default bg-surface px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
              {{ iniciales(m.nombre) }}
            </div>
            <span class="font-medium text-ink">{{ m.nombre }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-faint">{{ m.hora }}</span>
            <span v-if="Date.now() - m.timestamp < 8000" class="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold text-primary">
              NUEVO
            </span>
          </div>
        </div>
      </TransitionGroup>
      <p v-if="ultimos.length === 0" class="rounded-xl border border-dashed border-default py-6 text-center text-sm text-faint">
        Esperando escaneos…
      </p>
    </div>
  </div>
</template>

<style scoped>
.feed-enter-active { transition: all 0.4s ease; }
.feed-enter-from { opacity: 0; transform: translateY(-8px); }
</style>
