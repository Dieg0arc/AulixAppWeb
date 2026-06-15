import { Home, Calendar, BarChart3, User } from 'lucide-vue-next'
import type { Component } from 'vue'
import { ROLE_HOME, type Role } from './roles'

export interface NavItem {
  label: string
  to: string
  icon: Component
}

/**
 * Ítems de navegación por rol. Cada AppSidebar lee de aquí;
 * el componente no hardcodea su menú. Las rutas cuelgan de ROLE_HOME
 * para no duplicar la base del rol.
 */
export const NAV_ITEMS: Record<Role, NavItem[]> = {
  docente: [
    { label: 'Hoy', to: ROLE_HOME.docente, icon: Home },
    { label: 'Agenda', to: `${ROLE_HOME.docente}/agenda`, icon: Calendar },
    { label: 'Indicadores', to: `${ROLE_HOME.docente}/indicadores`, icon: BarChart3 },
    { label: 'Perfil', to: `${ROLE_HOME.docente}/perfil`, icon: User },
  ],
  estudiante: [],
  auxiliar: [],
  soporte: [],
}
