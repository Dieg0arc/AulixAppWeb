<script setup lang="ts">
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-vue-next'
import AppButton from '~/components/ui/AppButton.vue'
import { useSesionDetalle } from '~/features/docente/composables/useSesionDetalle'
import type { ChecklistEstado } from '~/features/docente/api/sesion.mock'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data, isPending, isError } = useSesionDetalle(id)

const CHECK: Record<ChecklistEstado, { icono: typeof CheckCircle2; clase: string; badge: string; tono: string }> = {
  ok: { icono: CheckCircle2, clase: 'text-ok', badge: 'OK', tono: 'bg-ok/10 text-ok' },
  opcional: { icono: XCircle, clase: 'text-faint', badge: 'OPCIONAL', tono: 'bg-warn/10 text-warn' },
  pendiente: { icono: XCircle, clase: 'text-danger', badge: 'PENDIENTE', tono: 'bg-danger/10 text-danger' },
}

function irAConfirmar() {
  router.push(`/docente/sesion/${id}/confirmar`)
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.back()">
      <ArrowLeft class="h-4 w-4" /> Volver
    </button>

    <div v-if="isPending" class="mt-6 space-y-4">
      <div class="h-40 animate-pulse rounded-2xl bg-subtle" />
      <div class="h-32 animate-pulse rounded-2xl bg-subtle" />
    </div>

    <p v-else-if="isError" class="mt-6 text-faint">No se pudo cargar la sesión.</p>

    <template v-else-if="data">
      <p class="mt-6 text-xs font-semibold tracking-wide text-faint">HU 02 · PASO 1 DE 2</p>
      <div class="mt-2 flex items-start justify-between gap-4">
        <div>
          <p class="text-lg font-medium text-faint">Sesión programada</p>
          <h1 class="mt-1 text-3xl font-bold text-ink">{{ data.practica }}</h1>
          <p class="mt-1 text-faint">{{ data.asignatura }} · Grupo {{ data.grupo }}</p>
        </div>
        <span class="shrink-0 rounded-lg bg-cobre/10 px-3 py-1.5 text-sm font-medium text-cobre">
          {{ data.esHoy ? 'HOY' : '' }} · {{ data.horaInicio }} → {{ data.horaFin }}
        </span>
      </div>

      <!-- Datos de la sesión -->
      <dl class="mt-6 space-y-4 rounded-2xl border border-default bg-surface p-6">
        <div class="grid grid-cols-3 gap-4 border-b border-default pb-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">LABORATORIO</dt>
          <dd class="col-span-2 text-ink">{{ data.laboratorio }} · {{ data.ubicacion }}</dd>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-default pb-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">CAPACIDAD</dt>
          <dd class="col-span-2 text-ink">{{ data.capacidad }}</dd>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-default pb-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">AUXILIAR</dt>
          <dd class="col-span-2 text-ink">
            {{ data.auxiliar ?? '—' }} <span v-if="data.auxiliar" class="text-faint">(asignado)</span>
          </dd>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">PRÁCTICA</dt>
          <dd class="col-span-2 text-ink">{{ data.descripcionPractica }}</dd>
        </div>
      </dl>

      <!-- Checklist -->
      <p class="mt-8 text-xs font-semibold tracking-wide text-faint">ANTES DE ABRIR</p>
      <div class="mt-3 space-y-3">
        <div
          v-for="item in data.checklist"
          :key="item.label"
          class="flex items-center justify-between rounded-xl border border-default bg-surface px-5 py-4"
        >
          <div class="flex items-center gap-3">
            <component :is="CHECK[item.estado].icono" class="h-5 w-5" :class="CHECK[item.estado].clase" />
            <span class="font-medium text-ink">{{ item.label }}</span>
          </div>
          <span class="rounded-md px-2.5 py-1 text-xs font-semibold" :class="CHECK[item.estado].tono">
            {{ CHECK[item.estado].badge }}
          </span>
        </div>
      </div>

      <AppButton size="lg" class="mt-8 w-full" @click="irAConfirmar">
        → Abrir sesión ahora
      </AppButton>
    </template>
  </div>
</template>
