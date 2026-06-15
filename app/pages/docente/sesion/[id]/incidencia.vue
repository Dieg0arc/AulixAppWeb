<script setup lang="ts">
import { ref, computed } from 'vue'
import { FlaskConical, Server, ChevronRight, Camera, Image as ImageIcon, Send } from 'lucide-vue-next'
import AppButton from '~/components/ui/AppButton.vue'
import { useContextoIncidencia } from '~/features/docente/composables/useIncidencia'
import { enviarIncidenciaMock, type TipoIncidencia } from '~/features/docente/api/incidencia.mock'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data } = useContextoIncidencia(id)

const TIPOS: { valor: TipoIncidencia; titulo: string; sub: string }[] = [
  { valor: 'equipo', titulo: 'Equipo', sub: 'Falla técnica' },
  { valor: 'seguridad', titulo: 'Seguridad', sub: 'Riesgo o robo' },
  { valor: 'infraestructura', titulo: 'Infraestructura', sub: 'Eléctrica, red' },
  { valor: 'otra', titulo: 'Otra', sub: 'Especificar' },
]

const tipo = ref<TipoIncidencia>('equipo')
const equipoId = ref<string | null>(null)
const descripcion = ref('')

// El equipo seleccionado, derivado del catálogo.
const equipoSel = computed(() => data.value?.equipos.find((e) => e.id === equipoId.value) ?? null)

// Por defecto selecciona el primer equipo cuando llega el catálogo (solo si tipo=equipo).
watch(data, (d) => {
  if (d && !equipoId.value && d.equipos.length) equipoId.value = d.equipos[0].id
}, { immediate: true })

const puedeEnviar = computed(() => descripcion.value.trim().length > 0)

const enviando = ref(false)
async function enviar() {
  if (!puedeEnviar.value) return
  enviando.value = true
  await enviarIncidenciaMock({
    tipo: tipo.value,
    equipoId: tipo.value === 'equipo' ? equipoId.value : null,
    descripcion: descripcion.value.trim(),
    evidencias: 0,
  })
  enviando.value = false
  router.push(`/docente/sesion/${id}`)
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.back()">
      ← Volver
    </button>

    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">HU 06</p>
    <h1 class="mt-2 text-3xl font-bold text-ink">Reportar incidencia</h1>

    <!-- Asociada a -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">ASOCIADA A</p>
    <div v-if="data" class="mt-2 flex items-center gap-3 rounded-2xl border border-default bg-cobre/5 px-5 py-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cobre/10 text-cobre">
        <FlaskConical class="h-5 w-5" />
      </div>
      <div>
        <p class="font-semibold text-ink">Sesión {{ data.sesionRef }}</p>
        <p class="text-sm text-faint">{{ data.laboratorio }}</p>
      </div>
    </div>

    <!-- Tipo -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">TIPO DE INCIDENCIA</p>
    <div class="mt-2 grid grid-cols-2 gap-3">
      <button
        v-for="t in TIPOS"
        :key="t.valor"
        type="button"
        class="rounded-2xl border p-4 text-left transition-colors"
        :class="tipo === t.valor
          ? 'border-primary bg-primary text-on-primary'
          : 'border-default bg-surface text-ink hover:bg-subtle'"
        @click="tipo = t.valor"
      >
        <p class="font-semibold">{{ t.titulo }}</p>
        <p class="text-sm" :class="tipo === t.valor ? 'text-on-primary/80' : 'text-faint'">{{ t.sub }}</p>
      </button>
    </div>

    <!-- Equipo afectado: solo si tipo = equipo -->
    <template v-if="tipo === 'equipo' && equipoSel">
      <p class="mt-6 text-xs font-semibold tracking-wide text-faint">EQUIPO AFECTADO</p>
      <button
        type="button"
        class="mt-2 flex w-full items-center gap-3 rounded-2xl border border-default bg-surface px-5 py-4 text-left transition-colors hover:bg-subtle"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-subtle text-faint">
          <Server class="h-5 w-5" />
        </div>
        <div class="flex-1">
          <p class="font-semibold text-ink">{{ equipoSel.nombre }}</p>
          <p class="text-sm text-faint">SN: {{ equipoSel.serie }} · #{{ equipoSel.numero }}</p>
        </div>
        <ChevronRight class="h-5 w-5 text-faint" />
      </button>
    </template>

    <!-- Descripción -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">DESCRIPCIÓN</p>
    <textarea
      v-model="descripcion"
      rows="3"
      class="mt-2 w-full rounded-xl border border-default bg-surface p-4 text-ink placeholder:text-faint focus:border-primary focus:outline-none"
      placeholder="Describe qué ocurrió…"
    />

    <!-- Evidencia (placeholder visual; la captura real llega con html5/cámara) -->
    <p class="mt-6 text-xs font-semibold tracking-wide text-faint">EVIDENCIA · Opcional · máx. 3</p>
    <div class="mt-2 grid grid-cols-3 gap-3">
      <div class="flex aspect-video items-center justify-center rounded-xl border border-dashed border-default bg-subtle text-xs text-faint">
        FOTO 1
      </div>
      <button type="button" class="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl bg-subtle text-faint transition-colors hover:bg-accent-soft">
        <Camera class="h-5 w-5" /> <span class="text-xs">Cámara</span>
      </button>
      <button type="button" class="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl bg-subtle text-faint transition-colors hover:bg-accent-soft">
        <ImageIcon class="h-5 w-5" /> <span class="text-xs">Galería</span>
      </button>
    </div>

    <AppButton size="lg" class="mt-8 w-full" :disabled="!puedeEnviar" :loading="enviando" @click="enviar">
      <Send class="h-4 w-4" /> Enviar a soporte técnico
    </AppButton>
  </div>
</template>
