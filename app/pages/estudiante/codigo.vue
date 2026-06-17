<script setup lang="ts">
import { QrCode, Delete } from 'lucide-vue-next'
import { useIntervalFn } from '@vueuse/core'
import { useSesionAbierta } from '~/features/estudiante/composables/useSesionAbierta'
import { useRegistrarAsistencia } from '~/features/estudiante/composables/useRegistrarAsistencia'

definePageMeta({ layout: 'estudiante' })

const router = useRouter()
const { data: sesionAbierta } = useSesionAbierta()
const { mutateAsync, isPending } = useRegistrarAsistencia()

// Inputs de los 6 dígitos
const digitos = ref<string[]>(['', '', '', '', '', ''])
const codigoCompleto = computed(() => digitos.value.join(''))
const listo = computed(() => codigoCompleto.value.length === 6)

// Countdown reactivo: recalcula contra sesionAbierta para funcionar incluso en acceso
// directo por URL (cuando la query llega después del setup).
const restante = ref(0)
const expirado = computed(() => restante.value <= 0)
const tiempo = computed(() => {
  const mm = String(Math.floor(restante.value / 60)).padStart(2, '0')
  const ss = String(restante.value % 60).padStart(2, '0')
  return `${mm}:${ss}`
})

function recalcularRestante() {
  if (!sesionAbierta.value) return
  const diff = new Date(sesionAbierta.value.codigoTiempo.expiresAt).getTime() - Date.now()
  restante.value = Math.max(0, Math.floor(diff / 1000))
}

const { pause } = useIntervalFn(recalcularRestante, 1000)
watch(sesionAbierta, recalcularRestante, { immediate: true })
onScopeDispose(pause)

// Teclado numérico en pantalla
const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'borrar']

function presionarTecla(val: string | null) {
  if (val === 'borrar') {
    const ultimo = [...digitos.value].reverse().findIndex((d) => d !== '')
    if (ultimo !== -1) digitos.value[5 - ultimo] = ''
    return
  }
  if (val === null) return
  const vacio = digitos.value.findIndex((d) => d === '')
  if (vacio !== -1) digitos.value[vacio] = val
}

const error = ref('')

async function confirmar() {
  if (!sesionAbierta.value || !listo.value) return
  error.value = ''
  try {
    await mutateAsync({
      sesionId: sesionAbierta.value.sesionId,
      metodo: 'codigo',
      codigo: codigoCompleto.value,
    })
    router.push('/estudiante/comprobante')
  } catch {
    error.value = 'Código incorrecto o expirado. Verifica e intenta de nuevo.'
    digitos.value = ['', '', '', '', '', '']
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm space-y-6">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.push('/estudiante')">
      ← Volver
    </button>

    <div>
      <p class="text-xs font-semibold tracking-wide text-faint">HU 11 · ALTERNATIVA AL QR</p>
      <h1 class="mt-1 text-2xl font-bold text-ink">Ingresar código</h1>
    </div>

    <!-- Countdown del código -->
    <div
      class="flex items-center justify-center gap-2 rounded-xl border border-default bg-surface py-3"
      :class="expirado ? 'border-danger/40 bg-danger/5' : ''"
    >
      <span class="h-2 w-2 rounded-full" :class="expirado ? 'bg-danger' : 'bg-ok animate-pulse'" />
      <p class="text-sm font-bold tracking-wide" :class="expirado ? 'text-danger' : 'text-ink'">
        {{ expirado ? 'CÓDIGO EXPIRADO' : `CÓDIGO VIGENTE · ${tiempo}` }}
      </p>
    </div>

    <!-- Práctica activa -->
    <div v-if="sesionAbierta" class="rounded-xl border border-default bg-surface px-4 py-3 text-sm">
      <p class="text-xs font-semibold tracking-wide text-faint mb-1">REGISTRANDO PARA</p>
      <p class="font-semibold text-ink">{{ sesionAbierta.practica }}</p>
      <p class="text-faint">{{ sesionAbierta.asignatura }}</p>
    </div>

    <!-- 6 casillas de dígito -->
    <div class="flex justify-center gap-2">
      <div
        v-for="(d, i) in digitos"
        :key="i"
        class="flex h-16 w-12 items-center justify-center rounded-xl border-2 text-2xl font-bold transition-colors"
        :class="d ? 'border-[#0891B2] bg-[#0891B2]/5 text-ink' : 'border-default bg-surface text-faint'"
      >
        {{ d || '—' }}
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="rounded-lg bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger">
      {{ error }}
    </p>

    <!-- Teclado numérico -->
    <div class="grid grid-cols-3 gap-3">
      <template v-for="tecla in teclas" :key="tecla ?? 'vacia'">
        <!-- Celda vacía (lugar de #) -->
        <div v-if="tecla === null" />

        <!-- Borrar -->
        <button
          v-else-if="tecla === 'borrar'"
          type="button"
          class="flex items-center justify-center rounded-xl border border-default bg-surface py-4 text-ink transition-colors hover:bg-subtle active:scale-95"
          @click="presionarTecla('borrar')"
        >
          <Delete class="h-5 w-5" />
        </button>

        <!-- Dígito -->
        <button
          v-else
          type="button"
          class="rounded-xl border border-default bg-surface py-4 text-lg font-bold text-ink transition-colors hover:bg-subtle active:scale-95"
          :disabled="listo"
          @click="presionarTecla(tecla)"
        >
          {{ tecla }}
        </button>
      </template>
    </div>

    <!-- Confirmar -->
    <button
      type="button"
      class="w-full rounded-2xl py-4 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      style="background-color: #0891B2;"
      :disabled="!listo || isPending || expirado"
      @click="confirmar"
    >
      <span v-if="isPending">Registrando…</span>
      <span v-else>Confirmar asistencia</span>
    </button>

    <!-- Ir a QR -->
    <button
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-xl border border-default py-3 text-sm font-medium text-ink transition-colors hover:bg-subtle"
      @click="router.push('/estudiante/qr')"
    >
      <QrCode class="h-4 w-4" />
      Escanear QR en cambio
    </button>
  </div>
</template>
