<script setup lang="ts">
import { MapPin, Users, ArrowRight, MoreHorizontal } from 'lucide-vue-next'
import type { SesionResumen } from '../api/sesiones.mock'

defineProps<{
  sesion: SesionResumen
}>()

const emit = defineEmits<{
  abrir: []
}>()
</script>

<template>
  <article class="relative overflow-hidden rounded-3xl bg-primary p-8 text-on-primary shadow-lg">
    <button
      type="button"
      class="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
      aria-label="Más opciones"
    >
      <MoreHorizontal class="h-5 w-5" />
    </button>

    <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
      <span class="h-1.5 w-1.5 rounded-full bg-current" />
      PRÓXIMA
    </span>

    <p class="mt-5 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold">
      {{ sesion.horaInicio }} → {{ sesion.horaFin }}
    </p>

    <h2 class="mt-4 text-3xl font-bold">{{ sesion.practica }}</h2>
    <p class="mt-1 text-on-primary/80">
      {{ sesion.asignatura }} · Grupo {{ sesion.grupo }}
    </p>

    <div class="mt-5 flex flex-wrap gap-3">
      <span class="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium">
        <MapPin class="h-4 w-4" />
        {{ sesion.laboratorio }}
      </span>
      <span class="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium">
        <Users class="h-4 w-4" />
        {{ sesion.estudiantesEsperados }} estudiantes
      </span>
    </div>

    <button
      type="button"
      class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
      @click="emit('abrir')"
    >
      Abrir sesión
      <ArrowRight class="h-4 w-4" />
    </button>
  </article>
</template>
