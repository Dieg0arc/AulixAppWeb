import { ref, computed, onScopeDispose } from 'vue'
import { useIntervalFn } from '@vueuse/core'

/**
 * Cronómetro ascendente: cuenta el tiempo transcurrido desde `desde`.
 * Devuelve el total en segundos y formateado HH:MM:SS.
 * Reutilizable por: sesión en curso (transcurrido), cierre (duración).
 */
export function useCronometro(desde: Date) {
  const transcurrido = ref(0)
  const calcular = () => {
    transcurrido.value = Math.max(0, Math.floor((Date.now() - desde.getTime()) / 1000))
  }
  calcular()
  const { pause } = useIntervalFn(calcular, 1000)
  onScopeDispose(pause)

  const formato = computed(() => {
    const s = transcurrido.value
    const hh = String(Math.floor(s / 3600)).padStart(2, '0')
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  })

  return { transcurrido, formato }
}

/**
 * Cuenta regresiva hasta `hasta`. Devuelve segundos restantes y formato MM:SS.
 * Reutilizable por: QR (vence en), código de tiempo (vence en).
 * Emite `expirado` cuando llega a cero.
 */
export function useCuentaRegresiva(hasta: Date) {
  const restante = ref(0)
  const calcular = () => {
    restante.value = Math.max(0, Math.floor((hasta.getTime() - Date.now()) / 1000))
  }
  calcular()
  const { pause } = useIntervalFn(calcular, 1000)
  onScopeDispose(pause)

  const expirado = computed(() => restante.value <= 0)
  const formato = computed(() => {
    const mm = String(Math.floor(restante.value / 60)).padStart(2, '0')
    const ss = String(restante.value % 60).padStart(2, '0')
    return `${mm}:${ss}`
  })

  return { restante, formato, expirado }
}
