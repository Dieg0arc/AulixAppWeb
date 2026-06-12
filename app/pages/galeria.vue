<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppBadge from '~/components/ui/AppBadge.vue'
import RoleBadge from '~/components/ui/RoleBadge.vue'

// Página temporal de verificación del design system.
// Se elimina cuando construyamos las páginas reales.
</script>

<template>
  <div class="min-h-screen bg-lienzo p-10 font-sans text-tinta">
    <h1 class="mb-8 text-2xl font-bold">Galería — Design System Aulix</h1>

    <AppCard class="mb-6">
      <h2 class="mb-4 text-lg font-semibold">Botones</h2>
      <div class="flex flex-wrap gap-3">
        <AppButton variant="primary">Abrir sesión</AppButton>
        <AppButton variant="secondary">Cancelar</AppButton>
        <AppButton variant="danger">Cerrar sesión</AppButton>
        <AppButton variant="ghost">Ver más</AppButton>
        <AppButton variant="primary" loading>Registrando…</AppButton>
        <AppButton variant="primary" disabled>Deshabilitado</AppButton>
      </div>
    </AppCard>

    <AppCard class="mb-6">
      <h2 class="mb-4 text-lg font-semibold">Badges de estado</h2>
      <div class="flex flex-wrap gap-3">
        <AppBadge tone="ok">Presente</AppBadge>
        <AppBadge tone="warn">Pendiente</AppBadge>
        <AppBadge tone="danger">Incidencia</AppBadge>
        <AppBadge tone="info">Abierta</AppBadge>
        <AppBadge tone="neutral">Cerrada</AppBadge>
      </div>
    </AppCard>

    <AppCard>
      <h2 class="mb-4 text-lg font-semibold">Badges de rol</h2>
      <div class="flex flex-wrap gap-3">
        <RoleBadge rol="docente" />
        <RoleBadge rol="estudiante" />
        <RoleBadge rol="auxiliar" />
        <RoleBadge rol="soporte" />
      </div>
    </AppCard>
  </div>
</template>
