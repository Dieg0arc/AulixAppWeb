/**
 * Helpers de formato de fecha para la UI. Centralizados para no repetir
 * configuraciones de toLocaleDateString por los componentes.
 * Locale fijo es-CO; el dominio usa 'YYYY-MM-DD'.
 */

const DIAS_LETRA = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

/** Parsea 'YYYY-MM-DD' como fecha LOCAL (evita el corrimiento de zona de new Date(str)). */
export function parseFecha(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Inicial del día de la semana: L, M, M, J, V, S, D. */
export function letraDia(iso: string): string {
  return DIAS_LETRA[parseFecha(iso).getDay()]
}

/** Número del día del mes: 19, 22, etc. */
export function numeroDia(iso: string): number {
  return parseFecha(iso).getDate()
}

/** Encabezado largo: 'JUEVES 22'. */
export function tituloDia(iso: string): string {
  const f = parseFecha(iso)
  const dia = f.toLocaleDateString('es-CO', { weekday: 'long' })
  return `${dia} ${f.getDate()}`.toUpperCase()
}

/** True si la fecha ISO corresponde a hoy. */
export function esHoy(iso: string): boolean {
  const hoy = new Date()
  const f = parseFecha(iso)
  return (
    f.getFullYear() === hoy.getFullYear() &&
    f.getMonth() === hoy.getMonth() &&
    f.getDate() === hoy.getDate()
  )
}
