import { defineStore } from 'pinia'
import type { Usuario } from '~/types/domain'
import type { Role } from '~/lib/constants/roles'

/**
 * Estado de cliente: el usuario autenticado y su rol.
 * Esto es lo ÚNICO que vive en Pinia. Los datos de servidor
 * (sesiones, incidencias, préstamos) van en TanStack Query.
 *
 * La lógica de login/logout (llamadas al backend) se implementa
 * en features/auth. Aquí solo vive el estado y sus mutadores.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null as Usuario | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.usuario !== null,
    rol: (state): Role | null => state.usuario?.rol ?? null,
    nombre: (state): string => state.usuario?.nombre ?? '',
  },

  actions: {
    setUsuario(usuario: Usuario) {
      this.usuario = usuario
    },
    clear() {
      this.usuario = null
    },
  },
})
