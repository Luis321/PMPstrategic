# ARCHITECTURE.md

## Visión general

PMP Mastery Lab es una SPA 100% estática (React + Vite + TypeScript) sin backend.
Todo el estado vive en el navegador (`localStorage`) y se sirve como archivos
estáticos desde GitHub Pages.

```
┌─────────────────────────────────────────────┐
│                Browser (cliente)              │
│                                                │
│  React App (HashRouter)                       │
│   ├── Layout (nav + theme)                    │
│   ├── Pages (Dashboard, Practice, Simulator…)  │
│   ├── Components (QuestionCard, …)             │
│   └── Services                                 │
│        ├── storage.ts        (localStorage)    │
│        ├── questionEngine.ts (selección)        │
│        ├── analyticsEngine.ts (mastery, patrones)│
│        └── studyPlanGenerator.ts (ruta 8 sem.)  │
│                                                │
│  Data: src/data/questions.ts (banco estático)  │
└─────────────────────────────────────────────┘
                     │
                     ▼
         localStorage (única persistencia)
```

## Estructura de carpetas

```
src/
├── components/       # Layout, QuestionCard (compartidos)
├── pages/            # Una página por ruta
├── services/         # Lógica de negocio pura (sin JSX)
│   ├── storage.ts             # load/save/export/import/reset
│   ├── questionEngine.ts      # selección de preguntas por modo
│   ├── analyticsEngine.ts     # mastery, patrones, readiness
│   └── studyPlanGenerator.ts  # generación/adaptación de la ruta
├── data/
│   └── questions.ts   # banco de preguntas (fuente única de verdad)
├── hooks/
│   └── useAppData.tsx # Context + persistencia automática
├── types/
│   └── index.ts        # todos los tipos del dominio
└── App.tsx             # routing + gate de onboarding
```

## Por qué esta arquitectura

- **Sin backend**: todo el estado (`AppData`) vive en un único objeto en memoria,
  sincronizado a `localStorage` en cada cambio vía `useEffect` en `useAppData.tsx`.
  Esto simplifica el modelo mental: un solo "documento" que se lee/escribe completo.
- **Servicios puros**: `questionEngine`, `analyticsEngine` y `studyPlanGenerator` no
  tienen dependencias de React — son funciones puras que reciben `AppData` y
  devuelven resultados. Esto los hace fáciles de testear si en el futuro se agregan
  tests unitarios.
- **HashRouter en vez de BrowserRouter**: GitHub Pages no soporta rutas del lado del
  servidor. `HashRouter` evita 404s en subrutas sin necesitar un `404.html` de
  redirección.
- **Tailwind v4 vía plugin de Vite**: sin `postcss.config.js` ni `tailwind.config.js`
  clásicos; la configuración vive en `vite.config.ts` + `@import "tailwindcss"` en
  `index.css`.

## Modelo de datos (resumen)

El objeto `AppData` (ver `src/types/index.ts`) es la única fuente de verdad y se
persiste completo en cada cambio:

```ts
interface AppData {
  version: number
  profile: UserProfile
  attempts: Attempt[]
  sessions: Session[]
  errorLog: ErrorLogEntry[]
  studyPlan?: StudyPlan
  assessments: AssessmentResult[]
  gamification: GamificationState
  topicMastery: Record<string, TopicMastery>
}
```

`topicMastery` se recalcula derivado de `attempts` (ver `analyticsEngine.computeTopicMastery`);
no se persiste como fuente primaria, se puede recalcular en cualquier momento.

## Flujo de una sesión de práctica

1. El usuario elige un modo en `Practice.tsx` → `questionEngine.selectForMode(...)`.
2. `QuestionCard` gestiona la interacción (selección, confianza, submit).
3. Al responder, `Practice.tsx` construye un `Attempt` y, si es incorrecto, una
   `ErrorLogEntry`, y los agrega a `AppData` vía `setData`.
4. Al terminar la última pregunta, se crea un `Session` y se muestra el resumen.
5. `Dashboard`/`Analytics`/`Patterns` derivan todas sus métricas de `attempts` +
   `errorLog` en tiempo real — no hay estado duplicado.

## Extensión futura

- **Spaced repetition real**: hoy `WeakAreas` prioriza por accuracy reciente; un
  algoritmo de repetición espaciada más formal (ej. SM-2 simplificado) puede
  añadirse en `analyticsEngine.ts` sin tocar la UI.
- **IndexedDB**: si el banco de preguntas crece mucho o el historial de intentos se
  vuelve muy grande, se puede migrar `storage.ts` de `localStorage` a `IndexedDB`
  manteniendo la misma interfaz pública (`loadAppData`/`saveAppData`).
