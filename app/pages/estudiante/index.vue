<script setup lang="ts">
import SesionAbiertaCard from '~/features/estudiante/components/SesionAbiertaCard.vue'
import AsignaturaFila from '~/features/estudiante/components/AsignaturaFila.vue'
import { useSesionAbierta } from '~/features/estudiante/composables/useSesionAbierta'
import { useMisPracticas } from '~/features/estudiante/composables/useMisPracticas'

definePageMeta({ layout: 'estudiante' })

const auth = useAuthStore()
const router = useRouter()

const nombre = computed(() => auth.nombre.split(' ')[0] ?? auth.nombre)

const { data: sesionAbierta, isPending: cargandoSesion } = useSesionAbierta()
const { data: asignaturas, isPending: cargandoAsignaturas } = useMisPracticas()

const HOY = new Date().toISOString().slice(0, 10)
const sesionesEstaSemana = computed(() =>
  asignaturas.value?.filter((a) => a.proximaSesion?.fecha === HOY).length ?? 0,
)

function irAQr() {
  router.push('/estudiante/qr')
}
function irACodigo() {
  router.push('/estudiante/codigo')
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <!-- Encabezado -->
    <header>
      <p class="text-xs font-semibold tracking-wide text-faint">ESTUDIANTE</p>
      <h1 class="mt-1 text-3xl font-bold text-ink">
        Hola, {{ nombre }} —
        <span style="color: #0891B2;">
          Tienes {{ sesionesEstaSemana }} sesión{{ sesionesEstaSemana !== 1 ? 'es' : '' }} hoy
        </span>
      </h1>
    </header>

    <!-- Sesión en curso (skeleton mientras carga) -->
    <div v-if="cargandoSesion" class="h-40 animate-pulse rounded-2xl bg-subtle" />
    <SesionAbiertaCard
      v-else-if="sesionAbierta"
      :sesion="sesionAbierta"
      @escanear-qr="irAQr"
      @ingresar-codigo="irACodigo"
    />

    <!-- Mis asignaturas -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-ink">
          MIS ASIGNATURAS
          <span class="ml-1 text-faint font-normal">· {{ asignaturas?.length ?? 0 }} matriculadas</span>
        </h2>
      </div>

      <div v-if="cargandoAsignaturas" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-subtle" />
      </div>

      <div v-else-if="!asignaturas?.length" class="rounded-xl border border-default bg-surface p-6 text-center text-sm text-faint">
        No tienes asignaturas matriculadas este semestre.
      </div>

      <div v-else class="space-y-2">
        <AsignaturaFila
          v-for="asig in asignaturas"
          :key="asig.id"
          :asignatura="asig"
        />
      </div>
    </section>
  </div>
</template>
