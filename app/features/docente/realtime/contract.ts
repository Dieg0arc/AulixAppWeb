/**
 * ⚠️ CONTRATO PROPUESTO — pendiente de acordar con backend ⚠️
 *
 * Define el evento que el backend emite por WebSocket cada vez que un
 * estudiante marca asistencia (por QR o por código de tiempo).
 *
 * Diego: lleva este contrato a la conversación con backend. Cuando se
 * confirme/ajuste, solo cambia este archivo + realtime/socket.mock.ts.
 * Las pantallas (qr.vue, codigo.vue) NO dependen de la forma del socket,
 * solo de useAsistenciaEnVivo().
 *
 * Canal sugerido: ws://.../docente/sesiones/:id/asistencia
 */

export type MetodoMarca = 'qr' | 'codigo'

/** Un estudiante marcó asistencia correctamente. */
export interface AttendanceMarked {
  tipo: 'asistencia.marcada'
  estudianteId: string
  nombre: string // "Marín, Diego" (apellido, nombre)
  metodo: MetodoMarca
  hora: string // "10:04" hora del servidor
  timestamp: number // epoch ms, para ordenar
}

/** Intento fallido (código inválido). Solo aplica a método 'codigo'. */
export interface AttendanceRejected {
  tipo: 'asistencia.rechazada'
  codigoIntentado: string // "A1234"
  motivo: 'codigo_invalido' | 'codigo_expirado' | 'duplicado'
  hora: string
  timestamp: number
}

/** Snapshot del contador (el backend lo emite al conectar y tras cada marca). */
export interface AttendanceCount {
  tipo: 'asistencia.conteo'
  confirmados: number
  total: number
}

export type AttendanceEvent = AttendanceMarked | AttendanceRejected | AttendanceCount
