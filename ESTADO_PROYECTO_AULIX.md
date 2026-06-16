# Aulix Web — Estado del Proyecto (Frontend)

> Documento maestro para retomar el desarrollo. Resume TODO lo decidido y construido.
> Última sesión: 15 jun 2026. Rol docente COMPLETO (PR#7, pusheado). Próximo paso: dashboards auxiliar / estudiante / soporte + registro 2 pasos.

---

## 1. Qué es Aulix

App web de **gestión de laboratorios universitarios**, trasladada desde una app Android (Kotlin/Compose) a web. Para la universidad (proyecto académico, Semestre VII).

**4 roles, cada uno con su dashboard independiente:**
- **Docente** (15 HU): abrir/cerrar sesiones de lab, asistencia por QR o código de 6 dígitos en tiempo real, reportar incidencias con foto, galería de evidencias, agenda filtrable, indicadores.
- **Estudiante** (6 HU): ver prácticas matriculadas, escanear QR o ingresar código para registrar asistencia, comprobante con ID.
- **Auxiliar** (7 HU): préstamos de equipos con búsqueda/escaneo, historial por día, ocupación de labs.
- **Soporte** (7 HU): bandeja de incidencias priorizada por severidad, detalle con línea de tiempo, historial por equipo, métricas.

**Flujos clave:** login único sin selector de rol (el backend detecta rol por credenciales), registro en 2 pasos, QR con countdown en tiempo real, código numérico de 6 dígitos con expiración.

---

## 2. Equipo y arquitectura general

- **2 personas**: Diego (Dieg0arc) = TODO el frontend. Otra persona = TODO el backend + base de datos.
- **Repos separados**: frontend en `Dieg0arc/AulixAppWeb`. Backend en otro repo.
- **Comunicación front↔back = SOLO el contrato de API** (OpenAPI). Nada más los acopla.
- **Backend**: FastAPI + base de datos. Monolito modular (NO microservicios).
- **El backend AÚN NO EXISTE** — por eso el frontend trabaja contra mocks que respetan el contrato acordado.

---

## 3. Stack frontend (decidido y justificado)

| Tecnología | Para qué |
|---|---|
| **Nuxt 4** (4.4.8) en modo **SPA** (`ssr: false`) | App interna tras login, sin SEO. SPA simplifica auth, despliegue y tiempo real. |
| **Pinia** | Estado de **cliente** únicamente (usuario autenticado + rol). |
| **TanStack Vue Query** | Estado de **servidor** (sesiones, incidencias, préstamos, etc.). NO va en Pinia. |
| **Tailwind CSS** | Estilos, con design tokens de Aulix. |
| **VueUse** | Composables (`useColorMode` para tema, `useIntervalFn` para countdowns, etc.). |
| **Zod** | Validación de formularios. |
| **qrcode** | Generar QR (docente). |
| **html5-qrcode** | Escanear QR con cámara (estudiante, auxiliar) — ⚠️ requiere HTTPS en prod. |
| **lucide-vue-next** | Iconos. |

**Regla de oro estado**: Pinia SOLO para usuario+rol. Todo lo que viene de la BD va en TanStack Query. Confundirlos = la mayor fuente de deuda técnica.

**Node 24.14.0** local. Repo en `~/Documents/Universidad/SemestreVII/PN/Construccion/Proyecto/AulixAppWeb`.

---

## 4. ⚠️ Nuxt 4 — convención `app/`

A diferencia de Nuxt 3, **TODO el código fuente vive bajo `app/`**. El alias `~/` apunta a `app/`, no a la raíz. Esto causó 2 tropiezos en la sesión 1 (CSS en lugar equivocado, app.vue con NuxtWelcome). Ya resueltos. Recordar: páginas, componentes, stores, assets, **composables** → todo bajo `app/`. Los composables en `app/composables/` se auto-importan (no requieren import explícito), igual que `computed`, `ref`, etc.

---

## 5. Decisiones pendientes con backend (críticas antes de dashboards)

1. **Contrato de API**: definir endpoints (login, sesiones, asistencia, incidencias, préstamos) → backend expone `openapi.json` → frontend genera tipos/cliente con `openapi-typescript`. Reemplaza los mocks.
2. **Token de auth**: dónde vive. Recomendado **cookie httpOnly + refresh** (inmune a XSS). Pendiente de acordar con backend. El frontend ya está abstraído: solo cambia el módulo `auth`.
3. **Protocolo WebSocket**: qué evento llega cuando un estudiante marca asistencia, con qué payload. Define la asistencia en vivo del docente. ⚠️ **El frontend ya propuso un contrato** (`AttendanceEvent` en `app/features/docente/realtime/contract.ts`) y construyó QR/código contra un mock que lo simula. **Diego debe llevar este contrato a backend para acordarlo.** Al confirmarse, solo cambia `realtime/socket.mock.ts`.
4. **Tiempo real**: se decidió **WebSocket** (no SSE ni polling) para asistencia en vivo.

---

## 6. ERD / Modelo de dominio (validado)

El ERD correcto modela: `Usuario`, `Rol`, `Facultad`, `Programa académico`, `Asignatura`, `Laboratorio`, `Equipo`, `Reserva`, `Sesion` (nace de una Reserva), `Asistencia` (método qr/codigo, presente bool), `Incidencia` (severidad, estado), `Evidencia`, `Prestamo` (vinculado a sesión), `Auditoria`.

Notas clave:
- `Sesion.reserva_id` → el docente abre sesión SOBRE una reserva existente.
- NO hay tabla `CodigoAsistencia`: el QR/código con expiración es lógica efímera del backend (endpoint que devuelve `{valor, expires_at}`), no recurso persistente.
- Tipos en `app/types/domain.ts` ya escritos en camelCase con union types para estados.

---

## 7. Estructura de carpetas actual

```
AulixAppWeb/
├── nuxt.config.ts          # SPA, módulos, runtimeConfig, fuente Inter
├── tailwind.config.ts      # darkMode: 'class' + tokens semánticos + marca
├── .env / .env.example     # NUXT_PUBLIC_API_BASE, NUXT_PUBLIC_WS_URL
├── public/
│   └── Logo-U.png          # logo universidad (⚠️ pesa 4.8MB, optimizar a futuro)
└── app/
    ├── app.vue             # <NuxtPage />
    ├── assets/css/main.css # directivas Tailwind + CSS vars de tema (:root / .dark) + body base
    ├── plugins/vue-query.ts
    ├── stores/auth.ts      # Pinia: usuario + rol (getters: isAuthenticated, rol, nombre)
    ├── middleware/
    │   ├── auth.global.ts  # protege todo; público: /login /register /galeria
    │   └── role.ts         # control de acceso por rol (UX, NO seguridad)
    ├── lib/
    │   ├── constants/
    │   │   ├── roles.ts    # ROLES, Role, ROLE_HOME, ROLE_COLOR, ROLE_LABEL
    │   │   └── status.ts   # labels de estados sesión/incidencia/préstamo
    │   └── validation/auth.ts  # loginSchema (Zod)
    ├── types/domain.ts     # entidades del ERD
    ├── components/ui/      # design system (migrado a tokens semánticos)
    │   ├── AppButton.vue   # variantes primary/secondary/danger/ghost + loading/disabled
    │   ├── AppCard.vue
    │   ├── AppBadge.vue    # tonos ok/warn/danger/info/neutral
    │   └── RoleBadge.vue   # color por rol desde ROLE_COLOR
    ├── composables/
    │   ├── useTheme.ts     # tema claro/oscuro (useColorMode); punto único de verdad
    │   └── useTiempoRestante.ts  # useCronometro (asc) + useCuentaRegresiva (desc); onScopeDispose limpia intervalos
    ├── components/
    │   └── shared/         # usados por 2+ roles (destilados del docente)
    │       ├── AppSidebar.vue   # nav por rol (prop items)
    │       ├── AppTopbar.vue    # fecha + toggle tema + campana
    │       ├── UserMenu.vue     # avatar iniciales + cerrar sesión
    │       └── EstadoBadge.vue  # badge tono ok/info/warn/danger/neutral + punto
    ├── features/
    │   ├── auth/composables/
    │   │   ├── useLogin.ts     # orquesta login (ÚNICO punto que cambia con backend)
    │   │   └── loginMock.ts    # ⚠️ MOCK temporal, borrar cuando exista backend
    │   └── docente/        # TODO el rol docente (15 HU)
    │       ├── api/        # mocks tipados (1 por dominio): sesiones, agenda,
    │       │               #   indicadores, sesion, sesionCurso, cierre,
    │       │               #   incidencia, evidencias — todos con TODO(backend)
    │       ├── composables/    # useMiDia, useAgenda, useIndicadores,
    │       │                   #   useSesionDetalle, useSesionCurso, useCierre,
    │       │                   #   useIncidencia, useEvidencias, useAsistenciaEnVivo
    │       ├── components/      # ProximaSesionCard, AccesosRapidos
    │       └── realtime/        # ⚠️ contrato WS PROPUESTO (llevar a backend)
    │           ├── contract.ts      # AttendanceEvent (marcada/rechazada/conteo)
    │           └── socket.mock.ts   # simula el WS; reemplazar por WebSocket real
    └── pages/
        ├── login.vue       # pantalla login completa + pulida + toggle de tema
        ├── galeria.vue     # ⚠️ TEMPORAL: galería del design system, borrar luego
        └── docente/        # rol docente
            ├── index.vue       # Mi día (próxima sesión + accesos rápidos)
            ├── agenda.vue      # selector días + filtro lab + lista agrupada
            ├── indicadores.vue # métricas + asistencia/asignatura + reservas + inasistencias
            ├── perfil.vue      # datos de cuenta desde store auth
            └── sesion/[id]/    # flujo de sesión (cuelga de un id de sesión)
                ├── abrir.vue       # HU02 paso 1: detalle + checklist
                ├── confirmar.vue   # HU02 paso 2: hora real + observaciones
                ├── index.vue       # HU07: sesión en curso (cronómetro + acciones)
                ├── cerrar.vue      # HU03: estado final + observaciones condicionales
                ├── qr.vue          # HU04: QR + countdown + asistentes en vivo
                ├── codigo.vue      # HU05: código 6 dígitos + confirmaciones en vivo
                ├── incidencia.vue  # HU06: tipo + equipo + descripción + evidencia
                └── evidencias.vue  # galería de capturas
```

---

## 8. Design system: tokens semánticos + dark mode (en tailwind.config.ts + main.css)

**Modelo de dos capas** (decidido en `feat/theming`). NO todos los colores son iguales:

**a) Tokens SEMÁNTICOS de UI** — cambian por tema. Definidos como **canales RGB sueltos** en CSS vars (`:root` claro / `.dark` oscuro) en `main.css`, y mapeados en Tailwind con `rgb(var(--token) / <alpha-value>)` para preservar el modificador de opacidad (`bg-surface/50`). Un componente escribe la clase UNA vez y funciona en ambos temas, sin variantes `dark:`.

| Clase Tailwind | Var CSS | Claro | Oscuro | Rol |
|---|---|---|---|---|
| `bg-canvas` | `--canvas` | `250 248 243` | `15 23 36` | fondo de página |
| `bg-surface` | `--surface` | `255 255 255` | `25 35 52` | superficies elevadas |
| `bg-subtle` | `--subtle` | `243 237 222` | `38 50 71` | secundario / hover |
| `text-ink` | `--text-base` | `15 39 66` | `226 232 240` | texto principal |
| `text-faint` | `--text-muted` | `107 126 150` | `148 163 184` | texto tenue |
| `bg-accent-soft` | `--accent-soft` | `220 231 245` | `30 58 95` | chips / hover |
| `border-default` | `--border` | `230 222 205` | `51 65 85` | bordes |
| `bg-primary` / `text-primary` | `--primary` | `44 91 168` | `143 168 212` | botón primario (cobalto-lavanda en dark) |
| `text-on-primary` | `--primary-fg` | `255 255 255` | `15 23 36` | texto sobre primario (invierte en dark) |

> Nota de naming: el token de texto es `ink` (no `base`) para no colisionar con la utilidad `text-base` (tamaño) de Tailwind. El texto tenue es `faint` (no `muted`) para distinguirlo del token físico viejo durante la migración.

**b) Colores de MARCA** — constantes físicas, NO cambian por tema. Siguen como hex en `tailwind.config.ts`:
```
cobalto #2C5BA8  (acento/enlaces/focus rings)
cobre   #B36A2E  acento
ok #16A34A · danger #DC2626 · warn #D97706
rol.docente #2C5BA8 · rol.estudiante #0891B2 · rol.auxiliar #059669 · rol.soporte #B36A2E
```

**Regla**: si un color representa un rol de interfaz que debe verse distinto en dark (fondo, superficie, texto, borde) → semántico. Si es identidad de marca o estado fijo → físico. Validado visualmente: cobalto/enlaces/focus rings conservan contraste suficiente sobre el slate oscuro, no se migraron.

Fuente: **Inter** (Google Fonts).

---

## 9. Estado de auth + tema (funcional)

- Login real funcionando con **mock** (`loginMock.ts`). Cuentas demo, contraseña `pass123`:
  - `c.gomez@cue.edu.co` → Docente
  - `estudiante@cue.edu.co` → Estudiante
  - `auxiliar@cue.edu.co` → Auxiliar
  - `soporte@cue.edu.co` → Soporte
- Flujo: validación Zod → mock → guarda en store → redirige a `ROLE_HOME[rol]`.
- Correo institucional validado: debe terminar en `@cue.edu.co`.
- Login pulido: logo U de fondo (tenue), iconos lucide (ojo ver/ocultar), "Recuperar", cuentas demo clicables que autocompletan.
- **Toggle de tema** (botón circular arriba-derecha): icono `Sun`/`Moon` invertido (muestra el destino, no el estado), `aria-label` dinámico, todo en tokens semánticos.
- **`useTheme()`** (composable, sobre `useColorMode` de VueUse): persiste en localStorage (`aulix-theme`), respeta `prefers-color-scheme` en primer arranque, aplica clase `dark` en `<html>`. Punto único de verdad; los futuros dashboards reutilizan este composable, no reimplementan el toggle.
- **Para conectar backend**: reemplazar la línea `loginMock(...)` en `useLogin.ts` por `POST /auth/login`. El resto no cambia.

---

## 10. Flujo de trabajo Git (establecido y dominado)

**Trunk-based ligero con PRs visuales en GitHub:**
1. `git checkout -b feat/<modulo>`
2. Construir + verificar con `npm run dev`
3. `git add . && git commit -m "feat: ..."` (commits semánticos)
4. `git push -u origin feat/<modulo>`
5. PR en GitHub: base `main` ← compare `feat/<modulo>` → Create → Merge → Confirm → Delete branch
6. Sincronizar local:
   ```
   git checkout main && git pull origin main
   git branch -d feat/<modulo> && git fetch --prune
   ```

Nunca commitear directo a `main`. `main` siempre desplegable. Excepción aceptada solo para `chore` triviales sin riesgo (ej. eliminar un asset subido por error).

---

## 11. Módulos completados (7 PRs)

1. **PR#1 `feat/setup-stack`** — stack instalado y configurado.
2. **PR#2 `feat/project-structure`** — roles, tipos dominio, auth store, middleware.
3. **PR#3 `feat/ui-components`** — design system + activación routing.
4. **PR#4 `feat/auth`** — login funcional (validación, mock, store, redirección).
5. **PR#5 `feat/login-polish`** — pulido visual del login (logo fondo, iconos, etc.).
6. **PR#6 `feat/theming`** — dark mode con tokens semánticos (CSS vars), `darkMode: 'class'`, migración de los 4 componentes UI + login, composable `useTheme`, toggle persistente.
7. **PR#7 `feat/docente-dashboard`** — rol docente COMPLETO (15 HU), pusheado a GitHub. Construido por sub-pasos verificables:
   - **Navegación**: Mi día, Agenda (selector días + filtro lab), Indicadores (métricas + asistencia/asignatura + estado reservas + inasistencias), Perfil.
   - **Flujo de sesión** (`/docente/sesion/[id]/`): apertura 2 pasos sobre reserva → sesión en curso (cronómetro) → cierre (estado final + observaciones condicionales requeridas si no es "normal").
   - **Tiempo real**: QR + countdown + asistentes en vivo (HU04); código 6 dígitos + confirmaciones válidas/inválidas en vivo (HU05). Aislado tras contrato `AttendanceEvent` + mock que simula el WS.
   - **Otros**: reportar incidencia (tipo/equipo/descripción/evidencia), galería de evidencias.
   - **Destiló `components/shared/`** (sidebar, topbar, user-menu, EstadoBadge) y los composables de tiempo, reutilizables por los otros 3 roles.

---

## 12. PRÓXIMOS PASOS (en orden recomendado)

### Antes de cualquier rol nuevo: cerrar contrato con backend
- **Llevar `AttendanceEvent` a backend** (sección 5.3). El frontend ya tiene una propuesta funcional; falta acordar el payload real del WebSocket de asistencia.
- Empujar para que backend exponga `openapi.json` y empezar a reemplazar mocks por el cliente generado.

### Siguientes roles (cada uno = un rol completo, una rama `feat/<rol>-dashboard`)
- **`feat/auxiliar-dashboard`** (7 HU): préstamos de equipos con búsqueda/escaneo, historial por día, ocupación de labs. Reutiliza `shared/` y composables de tiempo del docente.
- **`feat/estudiante-dashboard`** (6 HU): prácticas matriculadas, escanear QR / ingresar código, comprobante con ID. Consume el mismo contrato de asistencia (lado estudiante).
- **`feat/soporte-dashboard`** (7 HU): bandeja de incidencias por severidad, detalle con línea de tiempo, historial por equipo, métricas. Reutiliza el dominio de incidencias del docente.
- **Registro en 2 pasos** (puede ir como rama propia).

Patrón ya probado en docente: mock tipado → composable (TanStack Query) → componentes → página, por sub-pasos verificables. Estado de servidor en Query, estado de cliente en Pinia, tiempo real en ref local tras un contrato aislado.

---

## 13. Deuda técnica anotada (no urgente)

**Del rol docente (PR#7):**
- **Sesión no persiste en refresh**: el store auth vive solo en memoria; un F5 vacía Pinia y el middleware manda a login. Esperado sin backend (depende de la decisión de token cookie httpOnly, sección 5.2). En dev: navegar sin recargar.
- **Sin backend no hay estado de sesión persistente**: el mock de "Mi día" siempre devuelve `programada`; una sesión nunca pasa a `abierta` porque el "abrir" no persiste. Por eso la lógica de "accesos rápidos solo si sesión abierta" se decidió pero quedó **desactivada** (accesos siempre visibles) hasta que exista backend.
- **Pulido pendiente del docente**: (a) el countdown del QR/código no se reinicia al pulsar Renovar/Regenerar (recrear el composable reactivo es enredado para MVP); (b) el recuadro de iconos en las cards de "sesión en curso" se estira a todo el ancho en vez de quedar en cuadro pequeño; (c) captura de cámara real en incidencia/evidencias es placeholder (requiere HTTPS + getUserMedia, su propio sub-paso); (d) layout del perfil un poco apretado.

**Del rol auxiliar (en curso):**
- **`lib/fecha.ts` líneas 12 y 17 — acceso a array sin guard**: `fecha.ts` usa índices de array (`[0]`, etc.) sin optional-chaining; TypeScript reporta `number | undefined` / `string | undefined` en tres sitios (líneas 12×2 y 17). El archivo es compartido por todos los roles — si el auxiliar muestra fechas raras (campo vacío, NaN visible), buscar aquí primero. Fix: añadir `?.` y tipo de retorno explícito. No urgente mientras el mock siempre provee fechas válidas, pero revisar antes de conectar backend real. (Detectado en typecheck del sub-paso A del auxiliar.)

**Previa (sigue vigente):**
- **`Logo-U.png` como marca de agua en dark**: se ve apagado sobre fondo oscuro. Cosmético.
- `public/Logo-U.png` pesa **4.8 MB** → comprimir a ~100-200 KB.
- `pages/galeria.vue` + `/galeria` en `PUBLIC_ROUTES` → **borrar** cuando haya páginas reales.
- `loginMock.ts` + bloque cuentas demo → **borrar** cuando exista backend.
- Todos los mocks en `features/docente/api/` y `realtime/socket.mock.ts` → reemplazar por cliente real (marcados `TODO(backend)`).
- Sugerencia Vite `optimizeDeps` → opcional, cosmético.
- Ramas remotas mergeadas sin borrar en GitHub → limpiar (cosmético).

---

## 14. Reglas de criterio aplicadas (mantener)

- No sobreingeniería. Carpetas/archivos nacen cuando tienen contenido real.
- `features/<rol>/` = código de un solo rol. `components/shared/` = usado por 2+ roles. Nunca cruzar fronteras de feature.
- `pages/` delgadas (solo composición/routing). Lógica en `features/` y composables.
- Middleware de rol = UX + defensa en profundidad, NUNCA seguridad. Backend autoriza de verdad.
- Mocks marcados con TODO claro y aislados, para reemplazo de 1 línea cuando llegue backend.
- **Color**: tokens semánticos para UI que cambia por tema; físicos para marca. Cero hex sueltos en componentes (salvo valores dinámicos vía `:style`). Un componente nuevo se escribe con clases semánticas → nace dark-ready sin `dark:`.
- Higiene de ramas: una rama = un cambio lógico. Working tree limpio antes de ramificar.
