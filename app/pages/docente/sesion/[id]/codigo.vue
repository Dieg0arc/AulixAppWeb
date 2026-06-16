<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCw, Share2, CheckCircle2, XCircle } from 'lucide-vue-next'
import { useAsistenciaEnVivo } from '~/features/docente/composables/useAsistenciaEnVivo'
import { useCuentaRegresiva } from '~/composables/useTiempoRestante'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// Código de 6 dígitos. El backend lo genera con expiración; aquí lo simulo.
function generarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
const codigo = ref(generarCodigo())
const digitos = computed(() => codigo.value.split(''))

const venceEn = ref(new Date(Date.now() + 5 * 60 * 1000))
const { formato: tiempo } = useCuentaRegresiva(venceEn.value)

const { confirmados, total, feed } = useAsistenciaEnVivo({ totalEsperado: 24, confirmadosIniciales: 18 })

function haceCuanto(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `hace ${s}s`
  return `hace ${Math.floor(s / 60)}m`
}

function apellidoInicial(nombre: string) {
  const partes = nombre.split(',')
  const ape = partes[0]?.trim() ?? nombre
  const nom = partes[1]?.trim() ?? ''
  return `${ape}, ${nom[0] ?? ''}.`
}

function regenerar() {
  codigo.value = generarCodigo()
  venceEn.value = new Date(Date.now() + 5 * 60 * 1000)
}
</script>

<template>
  <div class="mx-auto max-w-xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.push(`/docente/sesion/${id}`)">
      ← Volver
    </button>

    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">HU 05 · ALTERNATIVA AL QR</p>
    <h1 class="mt-2 text-3xl font-bold text-ink">Código de tiempo</h1>
    <p class="mt-1 text-faint">Comparte este código con quienes no puedan escanear el QR.</p>

    <!-- Dígitos -->
    <div class="mt-6 flex justify-center gap-2">
      <div
        v-for="(d, i) in digitos"
        :key="i"
        class="flex h-20 w-14 items-center justify-center rounded-xl bg-ink text-3xl font-bold text-canvas"
      >
        {{ d }}
      </div>
    </div>
    <div class="mx-auto mt-2 h-1 max-w-md rounded-full bg-primary" />

    <p class="mt-4 text-center font-semibold tracking-wide text-faint">VENCE EN {{ tiempo }}</p>

    <div class="mt-4 flex justify-center gap-3">
      <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-default px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-subtle" @click="regenerar">
        <RotateCw class="h-4 w-4" /> Regenerar
      </button>
      <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-default px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-subtle">
        <Share2 class="h-4 w-4" /> Compartir
      </button>
    </div>

    <!-- Confirmaciones -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">
      CONFIRMACIONES · {{ confirmados }}/{{ total }}
    </p>
    <div class="mt-3 space-y-2">
      <TransitionGroup name="feed">
        <div
          v-for="f in feed.slice(0, 6)"
          :key="f.timestamp"
          class="flex items-center justify-between rounded-xl border px-4 py-3"
          :class="f.kind === 'rechazo' ? 'border-danger/30 bg-danger/5' : 'border-default bg-surface'"
        >
          <div class="flex items-center gap-3">
            <CheckCircle2 v-if="f.kind === 'marca'" class="h-5 w-5 text-ok" />
            <XCircle v-else class="h-5 w-5 text-danger" />
            <span class="font-medium" :class="f.kind === 'rechazo' ? 'text-danger' : 'text-ink'">
              <template v-if="f.kind === 'marca'">{{ apellidoInicial(f.nombre) }}</template>
              <template v-else>Código inválido · {{ f.codigoIntentado }}</template>
            </span>
          </div>
          <span class="text-sm text-faint">{{ haceCuanto(f.timestamp) }}</span>
        </div>
      </TransitionGroup>
      <p v-if="feed.length === 0" class="rounded-xl border border-dashed border-default py-6 text-center text-sm text-faint">
        Esperando confirmaciones…
      </p>
    </div>

    <button type="button" class="mt-6 w-full rounded-2xl border border-default py-4 text-sm font-semibold text-ink transition-colors hover:bg-subtle" @click="router.push(`/docente/sesion/${id}/qr`)">
      Volver al QR
    </button>
  </div>
</template>

<style scoped>
.feed-enter-active { transition: all 0.4s ease; }
.feed-enter-from { opacity: 0; transform: translateY(-8px); }
</style>
