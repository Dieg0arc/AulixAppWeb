<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { ROLE_LABEL } from '~/lib/constants/roles'

definePageMeta({ layout: 'auxiliar' })

const auth = useAuthStore()

const iniciales = computed(() => {
  const partes = auth.nombre.trim().split(/\s+/)
  const a = partes[0]?.[0] ?? ''
  const b = partes.length > 1 ? (partes[1]?.[0] ?? '') : ''
  return (a + b).toUpperCase() || '?'
})
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h1 class="text-3xl font-bold text-ink">Perfil</h1>
    <p class="mt-1 text-faint">Tu cuenta institucional.</p>

    <section class="mt-8 rounded-2xl border border-default bg-surface p-8">
      <!-- Cabecera -->
      <div class="flex items-center gap-5">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-on-primary"
          :style="{ backgroundColor: '#059669' }"
        >
          {{ iniciales }}
        </div>
        <div>
          <p class="text-2xl font-bold text-ink">{{ auth.nombre }}</p>
          <p class="mt-1 flex items-center gap-2 text-sm text-faint">
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: '#059669' }" />
            {{ ROLE_LABEL[auth.rol ?? 'auxiliar'] }}
          </p>
        </div>
      </div>

      <!-- Datos -->
      <dl class="mt-8 space-y-5 border-t border-default pt-8">
        <div class="grid grid-cols-3 items-center gap-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">CORREO</dt>
          <dd class="col-span-2 text-ink">{{ auth.usuario?.email ?? '—' }}</dd>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">ROL</dt>
          <dd class="col-span-2 font-medium text-ink">{{ ROLE_LABEL[auth.rol ?? 'auxiliar'] }}</dd>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <dt class="text-xs font-semibold tracking-wide text-faint">ESTADO</dt>
          <dd class="col-span-2">
            <span
              v-if="auth.usuario?.activo"
              class="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-3 py-1 text-sm font-medium text-ok"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-ok" />
              Activo
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1 text-sm font-medium text-faint"
            >
              Inactivo
            </span>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>
