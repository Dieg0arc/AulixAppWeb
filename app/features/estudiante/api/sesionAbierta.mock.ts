// TODO(backend): GET /api/estudiante/sesion-abierta
// Response: SesionAbierta | null  (null si el docente no ha abierto sesión para ninguna de tus asignaturas)
import type { MetodoAsistencia } from '~/types/domain'

/** Código de tiempo emitido por el docente con expiración. */
export interface CodigoTiempo {
  valor: string   // 6 dígitos, ej. '391847'
  expiresAt: string // ISO 8601
}

/**
 * Vista desnormalizada de la sesión que el docente tiene abierta
 * para una de las asignaturas del estudiante.
 * El backend entregará este objeto ya resuelto (asignatura, lab, código vigente).
 */
export interface SesionAbierta {
  sesionId: string
  practica: string
  asignatura: string
  laboratorio: string
  codigoTiempo: CodigoTiempo
}

// TODO(backend): reemplazar por $fetch('/estudiante/sesion-abierta')
export async function fetchSesionAbiertaMock(): Promise<SesionAbierta | null> {
  await new Promise((r) => setTimeout(r, 300))
  return {
    sesionId: 'ses-001',
    practica: 'Configuración VLAN',
    asignatura: 'Programación de Redes',
    laboratorio: 'Lab-B-204',
    codigoTiempo: {
      valor: '391847',
      expiresAt: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
    },
  }
}

// TODO(backend): POST /api/estudiante/asistencia
// Body: RegistrarAsistenciaPayload
// Response: ComprobanteAsistencia
export interface RegistrarAsistenciaPayload {
  sesionId: string
  metodo: MetodoAsistencia
  codigo?: string  // 6 dígitos — solo cuando metodo === 'codigo'
  qrData?: string  // contenido escaneado del QR — solo cuando metodo === 'qr'
}

export interface ComprobanteAsistencia {
  id: string
  sesionId: string
  practica: string
  asignatura: string
  laboratorio: string
  fecha: string // 'DD/MM/YYYY'
  hora: string  // 'HH:mm'
  metodo: MetodoAsistencia
}

export async function registrarAsistenciaMock(
  payload: RegistrarAsistenciaPayload,
): Promise<ComprobanteAsistencia> {
  await new Promise((r) => setTimeout(r, 600))
  const ahora = new Date()
  return {
    id: `ast-${Date.now()}`,
    sesionId: payload.sesionId,
    practica: 'Configuración VLAN',
    asignatura: 'Programación de Redes',
    laboratorio: 'Lab-B-204',
    fecha: ahora.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
    metodo: payload.metodo,
  }
}
