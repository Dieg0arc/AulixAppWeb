<script setup lang="ts">
import { ref, computed } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useSesionDetalle } from '~/features/docente/composables/useSesionDetalle'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data } = useSesionDetalle(id)

const ahora = new Date()
const horaReal = computed(() =>
  ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
)
const fechaReal = computed(() =>
  ahora.toLocaleDateString('es-CO', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
)

const observaciones = ref('')
const MAX = 500

const PLANTILLAS = ['Asistencia parcial', 'Equipo con falla', 'Material listo', 'Cambio de aula']
function agregarPlantilla(txt: string) {
  const sep = observaciones.value && !observaciones.value.endsWith(' ') ? ' ' : ''
  observaciones.value = (observaciones.value + sep + txt).slice(0, MAX)
}

const enviando = ref(false)
async function confirmar() {
  enviando.value = true
  await new Promise((r) => setTimeout(r, 600))
  enviando.value = false
  router.push(`/docente/sesion/${id}`)
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.back()">
      ← Volver
    </button>

    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">HU 02 · PASO 2 DE 2</p>
    <h1 class="mt-2 text-3xl font-bold text-ink">Confirmar apertura</h1>

    <div v-if="data" class="mt-5 rounded-xl border-l-4 border-primary bg-accent-soft px-5 py-4">
      <p class="font-medium text-ink">
        {{ data.practica }} · {{ data.laboratorio }} · Grupo {{ data.grupo }}
      </p>
    </div>

    <div class="mt-6 rounded-2xl border border-default bg-surface p-6">
      <p class="text-xs font-semibold tracking-wide text-faint">HORA REAL DE APERTURA</p>
      <p class="mt-2 text-5xl font-bold text-ink">{{ horaReal }}</p>
      <p class="mt-2 text-sm text-faint">{{ fechaReal }}</p>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold tracking-wide text-faint">OBSERVACIONES DE APERTURA</label>
        <span class="text-xs text-faint">Opcional</span>
      </div>
      <textarea
        v-model="observaciones"
        :maxlength="MAX"
        rows="3"
        class="mt-2 w-full rounded-xl border border-default bg-surface p-4 text-ink placeholder:text-faint focus:border-primary focus:outline-none"
        placeholder="Notas sobre el estado del laboratorio al abrir…"
      />
      <p class="mt-1 text-right text-xs text-faint">{{ observaciones.length }} / {{ MAX }}</p>

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="p in PLANTILLAS"
          :key="p"
          type="button"
          class="rounded-lg border border-default px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-soft"
          @click="agregarPlantilla(p)"
        >
          + {{ p }}
        </button>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-3">
      <AppButton variant="secondary" size="lg" @click="router.back()">Cancelar</AppButton>
      <AppButton size="lg" :loading="enviando" @click="confirmar">Confirmar apertura</AppButton>
    </div>
  </div>
</template>
