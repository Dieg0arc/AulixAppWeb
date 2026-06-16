<script setup lang="ts">
import { Camera, Image as ImageIcon, Mic, Plus } from 'lucide-vue-next'
import { useEvidencias } from '~/features/docente/composables/useEvidencias'

definePageMeta({ layout: 'docente' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data, isPending, isError } = useEvidencias(id)
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <button class="flex items-center gap-2 text-sm font-medium text-primary" @click="router.back()">
      ← Volver
    </button>

    <div class="mt-6 flex items-start justify-between gap-4">
      <h1 class="text-3xl font-bold text-ink">Evidencias</h1>
      <div class="flex gap-2">
        <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90">
          <Camera class="h-4 w-4" /> Tomar
        </button>
        <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-default px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-subtle">
          <ImageIcon class="h-4 w-4" /> Galería
        </button>
      </div>
    </div>

    <div v-if="data" class="mt-3 flex items-center gap-3 text-sm">
      <span class="rounded-full bg-accent-soft px-3 py-1 font-medium text-primary">
        {{ data.items.length }} evidencias
      </span>
      <span class="text-faint">{{ data.fecha }} · {{ data.laboratorio }}</span>
    </div>

    <div v-if="isPending" class="mt-6 grid grid-cols-2 gap-4">
      <div v-for="n in 4" :key="n" class="h-48 animate-pulse rounded-2xl bg-subtle" />
    </div>

    <p v-else-if="isError" class="mt-6 text-faint">No se pudieron cargar las evidencias.</p>

    <div v-else-if="data" class="mt-6 grid grid-cols-2 gap-4">
      <!-- Items -->
      <article
        v-for="ev in data.items"
        :key="ev.id"
        class="overflow-hidden rounded-2xl border border-default bg-surface"
      >
        <div class="flex aspect-video items-center justify-center bg-subtle text-xs font-medium text-faint">
          FOTO · {{ ev.hora }}
        </div>
        <div class="p-4">
          <p class="font-semibold text-ink">{{ ev.titulo }}</p>
          <p class="mt-1 flex items-center gap-2 text-sm text-faint">
            {{ ev.hora }} · Foto
            <span v-if="ev.adjuntaA" class="text-cobre">adjunta a {{ ev.adjuntaA }}</span>
          </p>
        </div>
      </article>

      <!-- Nota de voz (acción) -->
      <button type="button" class="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-default bg-subtle text-faint transition-colors hover:bg-accent-soft">
        <Mic class="h-7 w-7 text-primary" />
        <span class="text-sm font-medium">Nota de voz</span>
      </button>

      <!-- Añadir (acción) -->
      <button type="button" class="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-default bg-subtle text-faint transition-colors hover:bg-accent-soft">
        <Plus class="h-7 w-7 text-primary" />
        <span class="text-sm font-medium">Añadir</span>
      </button>
    </div>

    <button type="button" class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90">
      <Camera class="h-4 w-4" /> Capturar nueva
    </button>
  </div>
</template>
