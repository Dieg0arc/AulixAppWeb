<script setup lang="ts">
import { Eye, EyeOff, Sun, Moon } from 'lucide-vue-next'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { loginSchema } from '~/lib/validation/auth'
import { useLogin } from '~/features/auth/composables/useLogin'
import { ROLE_COLOR, ROLE_LABEL, type Role } from '~/lib/constants/roles'

const { login, loading, error } = useLogin()
const { isDark, toggle } = useTheme()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const fieldErrors = ref<{ email?: string; password?: string }>({})

const demoAccounts: { rol: Role; email: string }[] = [
  { rol: 'docente', email: 'c.gomez@cue.edu.co' },
  { rol: 'estudiante', email: 'estudiante@cue.edu.co' },
  { rol: 'auxiliar', email: 'auxiliar@cue.edu.co' },
  { rol: 'soporte', email: 'soporte@cue.edu.co' },
]

function fillDemo(demoEmail: string) {
  email.value = demoEmail
  password.value = 'pass123'
}

async function onSubmit() {
  fieldErrors.value = {}
  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
    remember: remember.value,
  })
  if (!result.success) {
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
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-4 font-sans">
    <button
      type="button"
      :aria-label="isDark ? 'Activar tema claro' : 'Activar tema oscuro'"
      class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-default bg-surface text-faint transition-colors hover:bg-accent-soft hover:text-cobalto"
      @click="toggle"
    >
      <Sun v-if="isDark" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </button>
    <!-- Logo institucional de fondo (marca de agua a color, tenue, abajo a la izquierda) -->
    <img
      src="/Logo-U.png"
      alt=""
      aria-hidden="true"
      class="pointer-events-none fixed bottom-5 left-20 w-[1000px] max-w-none -translate-x-1/4 translate-y-1/4 select-none opacity-[0.10]"
    />

    <AppCard class="relative z-10 w-full max-w-md">
      <div class="mb-6 flex items-center justify-between">
        <span class="text-xl font-bold text-cobalto">Aulix</span>
        <span class="text-xs font-semibold tracking-wide text-faint">INICIA SESIÓN</span>
      </div>

      <h2 class="text-2xl font-bold leading-tight text-ink">
        Bienvenida a tu laboratorio digital.
      </h2>
      <p class="mt-1 text-sm text-faint">Usa tu cuenta institucional.</p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-xs font-semibold text-faint">CORREO INSTITUCIONAL</label>
          <input
            v-model="email"
            type="email"
            placeholder="c.gomez@cue.edu.co"
            class="w-full rounded-lg border border-default bg-surface px-3 py-2 text-ink outline-none focus:border-cobalto focus:ring-2 focus:ring-cobalto/30"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-xs text-danger">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <div class="mb-1 flex items-center justify-between">
            <label class="text-xs font-semibold text-faint">CONTRASEÑA</label>
            <button type="button" class="text-xs font-medium text-cobalto hover:underline">
              Recuperar
            </button>
          </div>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-lg border border-default bg-surface px-3 py-2 pr-10 text-ink outline-none focus:border-cobalto focus:ring-2 focus:ring-cobalto/30"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-cobalto"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
          <p v-if="fieldErrors.password" class="mt-1 text-xs text-danger">{{ fieldErrors.password }}</p>
        </div>

        <label class="flex items-center gap-2 text-sm text-faint">
          <input v-model="remember" type="checkbox" class="rounded border-default" />
          Mantener sesión iniciada en este dispositivo
        </label>

        <p v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{{ error }}</p>

        <AppButton type="submit" variant="primary" :loading="loading" class="w-full">
          Entrar →
        </AppButton>
      </form>

      <p class="mt-6 text-center text-sm text-faint">
        ¿Aún no tienes cuenta?
        <NuxtLink to="/register" class="font-medium text-cobalto hover:underline">Regístrate →</NuxtLink>
      </p>

      <div class="mt-6 border-t border-default pt-4">
        <p class="mb-2 text-xs font-semibold text-faint">
          CUENTAS DEMO · contraseña <span class="font-bold">pass123</span>
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="acc in demoAccounts"
            :key="acc.rol"
            type="button"
            class="flex items-center gap-2 rounded-lg border border-default bg-surface px-3 py-2 text-left text-sm text-ink hover:bg-accent-soft/40"
            @click="fillDemo(acc.email)"
          >
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: ROLE_COLOR[acc.rol] }" />
            {{ ROLE_LABEL[acc.rol] }}
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>
