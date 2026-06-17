# AGENTS.md — Reglas para agentes IA en Aulix (frontend)

> Este archivo es de lectura OBLIGATORIA antes de cualquier acción.
> Aulix es el frontend (Nuxt 4, modo SPA) de una app de gestión de
> laboratorios universitarios. El rol DOCENTE ya está completo y es la
> referencia de patrones. Si una instrucción de chat contradice este
> archivo, PÁRATE y pregunta — no improvises.

---

## 0. Antes de escribir una sola línea

1. Lee `ESTADO_PROYECTO_AULIX.md` en la raíz. Es la fuente de verdad sobre
   arquitectura, decisiones y estructura. No la contradigas.
2. Lee los archivos que vas a reutilizar y CÍTAME su firma real (props,
   emits, parámetros) ANTES de usarlos. Nunca inventes props ni campos.
3. Si te falta un tipo, un contrato o una firma, dilo. No rellenes el hueco
   en silencio con una suposición.

---

## 1. NO TOCAR (zonas congeladas)

Estas rutas están terminadas y en producción del repo. No las edites,
renombres, ni "mejores" salvo que yo lo pida EXPLÍCITAMENTE en el chat:

- `app/features/docente/**` — rol docente completo (PR#7).
- `app/features/auth/**` y `app/stores/auth.ts` — autenticación.
- `app/components/ui/**` (AppButton, AppCard, AppBadge, RoleBadge) — design
  system. Se USA, no se modifica.
- `app/components/shared/**` (AppSidebar, AppTopbar, UserMenu, EstadoBadge) —
  se REUTILIZA, no se duplica ni se edita.
- `app/composables/useTheme.ts` y `useTiempoRestante.ts` — se reutilizan.
- `tailwind.config.ts`, `app/assets/css/main.css`, `nuxt.config.ts` —
  configuración base. No tocar sin pedírmelo.
- `app/middleware/**`, `app/lib/constants/**` — solo lectura salvo orden
  explícita.

Si crees que NECESITAS tocar algo de aquí, PÁRATE y explícame por qué antes
de hacerlo.

---

## 2. DÓNDE SÍ trabajas

Para un rol nuevo (ej. auxiliar), solo creas/editas:

- `app/features/<rol>/**` — todo el código del rol (api/, composables/,
  components/).
- `app/pages/<rol>/**` — páginas delgadas (solo composición + routing).
- `app/types/domain.ts` — SOLO para AÑADIR tipos que falten, y
  consultándome primero. No reescribas los existentes.

Nunca cruces la frontera de una feature. `features/<rol>/` = código de un
solo rol. Lo compartido vive en `components/shared/` y ya existe.

---

## 3. Reglas de arquitectura (no negociables)

- **Todo bajo `app/`.** El alias `~/` apunta a `app/`, no a la raíz.
- **Composables** en `app/composables/` se auto-importan (sin import).
  **Constantes** en `app/lib/` NO se auto-importan (import explícito).
- **Estado:** Pinia SOLO para auth (usuario + rol). TODO lo que viene de la
  BD va en TanStack Query. Mezclarlos está prohibido.
- **Tiempo real:** en un `ref` local, detrás de un contrato aislado (como
  hizo el docente con `AttendanceEvent`). Nunca en Pinia.
- **Páginas delgadas:** `pages/` solo compone y enruta. La lógica vive en
  composables y `features/`.
- **Middleware de rol = UX**, nunca seguridad. El backend autoriza de verdad.

---

## 4. Backend: NO EXISTE. Regla de mocks

El backend (FastAPI) aún no existe. No inventes contratos en silencio.

- Cada fuente de datos = un mock TIPADO y AISLADO en
  `app/features/<rol>/api/`.
- Cada mock lleva un comentario `// TODO(backend):` describiendo el endpoint
  real y el payload esperado.
- El objetivo es reemplazo de UNA línea cuando llegue el backend.
- Si una pantalla dependiera de un contrato inexistente (ej. WebSocket),
  AÍSLALO tras un contrato propuesto y AVÍSAME. No lo inventes y sigas.

---

## 5. Estilo y tokens

- Usa SOLO tokens semánticos: `bg-canvas`, `bg-surface`, `bg-subtle`,
  `text-ink`, `text-faint`, `border-default`, `bg-accent-soft`,
  `bg-primary`, `text-on-primary`, etc.
- CERO clases `dark:`. Los tokens ya son dark-ready.
- CERO hex sueltos en componentes (salvo valores dinámicos vía `:style`).
- Colores de marca/rol salen de `app/lib/constants/roles.ts`
  (ROLE_COLOR, ROLE_HOME). No los hardcodees.
- Un componente nuevo nace dark-ready sin `dark:` si usa tokens.

---

## 6. Cámara / escaneo QR

`html5-qrcode` requiere HTTPS + getUserMedia (ya anotado como deuda
técnica). NO implementes captura de cámara real ahora. Déjalo como
placeholder aislado en su propio componente. Si vas a meter `getUserMedia`,
PÁRATE y pregúntame.

---

## 7. Cómo trabajas (ritmo)

Construye por SUB-PASOS verificables, en este orden:
  A) tipos faltantes + mocks tipados (`api/`)
  B) composables (TanStack Query)
  C) componentes (`features/<rol>/components/`)
  D) páginas (`pages/<rol>/`)

- Tras CADA sub-paso, muéstrame el diff y PÁRATE hasta que confirme.
- Tras un bloque de creación de varios archivos, lista (`ls`) el directorio
  para confirmar que TODOS se crearon. (Han faltado archivos por comandos
  que no se ejecutaron.)
- Antes de usar un componente/store/composable existente, cítame su firma
  real (lectura del archivo). No inventes props ni campos.

---

## 8. Git

- Una rama = un rol completo (`feat/<rol>-dashboard`).
- Commits semánticos por sub-paso (`feat:`, `fix:`, `chore:`).
- UN push al final → PR. Nunca commits directos a `main`.
- `main` siempre desplegable.

---

## 9. Antipatrones — NO hagas esto

- ❌ Duplicar AppSidebar/AppTopbar/EstadoBadge "porque era más rápido".
- ❌ Meter datos de servidor en Pinia.
- ❌ Inventar props, campos de tipo, o endpoints de backend.
- ❌ Clases `dark:` o hex sueltos en componentes.
- ❌ Lógica de negocio dentro de `pages/`.
- ❌ Editar el rol docente, auth o el design system sin orden explícita.
- ❌ Generar 15 archivos de golpe sin puntos de verificación.
- ❌ Implementar getUserMedia / cámara real ahora.
