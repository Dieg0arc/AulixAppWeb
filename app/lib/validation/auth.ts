import { z } from 'zod'

/**
 * Validación del formulario de login.
 * El correo debe ser institucional (dominio @cue.edu.co según el diseño).
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Correo no válido')
    .endsWith('@cue.edu.co', 'Usa tu correo institucional (@cue.edu.co)'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
  remember: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
