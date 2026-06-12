<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { loginSchema } from '~/lib/validation/auth'
import { useLogin } from '~/features/auth/composables/useLogin'

const { login, loading, error } = useLogin()

const email = ref('')
const password = ref('')
const remember = ref(false)

// Errores de validación por campo
const fieldErrors = ref<{ email?: string; password?: string }>({})

async function onSubmit() {
  fieldErrors.value = {}

  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
    remember: remember.value,
  })

  if (!result.success) {
    // Mapea el primer error de cada campo
    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password'
      if (field && !fieldErrors.value[field]) {
        fieldErrors.value[field] = issue.message
      }
    }
    return
  }

  await login(email.value, password.value)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-lienzo p-4 font-sans">
    <AppCard class="w-full max-w-md">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-cobalto">Aulix</h1>
        <h2 class="mt-4 text-xl font-semibold text-tinta">
          Bienvenida a tu laboratorio digital.
        </h2>
        <p class="mt-1 text-sm text-muted">Usa tu cuenta institucional.</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- Correo -->
        <div>
          <label class="mb-1 block text-xs font-semibold text-muted">
            CORREO INSTITUCIONAL
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="c.gomez@cue.edu.co"
            class="w-full rounded-lg border border-arena bg-surface px-3 py-2 text-tinta outline-none focus:border-cobalto focus:ring-2 focus:ring-cobalto/30"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-xs text-danger">
            {{ fieldErrors.email }}
          </p>
        </div>

        <!-- Contraseña -->
        <div>
          <label class="mb-1 block text-xs font-semibold text-muted">
            CONTRASEÑA
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full rounded-lg border border-arena bg-surface px-3 py-2 text-tinta outline-none focus:border-cobalto focus:ring-2 focus:ring-cobalto/30"
          />
          <p v-if="fieldErrors.password" class="mt-1 text-xs text-danger">
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- Mantener sesión -->
        <label class="flex items-center gap-2 text-sm text-muted">
          <input v-model="remember" type="checkbox" class="rounded border-arena" />
          Mantener sesión iniciada en este dispositivo
        </label>

        <!-- Error general -->
        <p v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {{ error }}
        </p>

        <!-- Botón -->
        <AppButton type="submit" variant="primary" :loading="loading" class="w-full">
          Entrar
        </AppButton>
      </form>

      <p class="mt-6 text-center text-sm text-muted">
        ¿Aún no tienes cuenta?
        <NuxtLink to="/register" class="font-medium text-cobalto hover:underline">
          Regístrate →
        </NuxtLink>
      </p>

      <!-- Cuentas demo (temporal, mientras no hay backend) -->
      <div class="mt-6 rounded-lg bg-arena/50 p-3 text-xs text-muted">
        <p class="font-semibold">CUENTAS DEMO · contraseña pass123</p>
        <p>c.gomez@cue.edu.co (Docente)</p>
        <p>estudiante@cue.edu.co · auxiliar@cue.edu.co · soporte@cue.edu.co</p>
      </div>
    </AppCard>
  </div>
</template>
