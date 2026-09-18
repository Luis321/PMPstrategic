# PMP Mastery Lab

Aplicación web 100% estática para prepararte para el examen PMP — no memorizando
respuestas, sino entrenando el razonamiento situacional que el examen evalúa.

## Características

- **Ruta de estudio de 8 semanas**, adaptativa según tu diagnóstico inicial y tus simulacros.
- **Banco de preguntas situacionales** con escenario → decisión → feedback → regla mental reutilizable.
- **8 modos de práctica**: Quick Practice, Focus Mode, Domain Practice, Approach Practice, Weak Areas, Mistakes Retry, Random Challenge, PMP Mindset Challenge.
- **Simulacros progresivos** (20/30/60/90/120 preguntas), ponderados según el ECO vigente.
- **Error Log** con clasificación de errores y **Mis Patrones** (detección automática de errores recurrentes).
- **PMP Mindset**: los 17 principios de razonamiento situacional del examen.
- **Analytics**: accuracy por dominio, enfoque y tema; mastery por tema.
- **PMP Readiness**: indicador interno de preparación (no es una predicción oficial de PMI).
- 100% local: todo tu progreso vive en `localStorage` de tu navegador. Export/Import de backup en JSON.

## Stack

- React + TypeScript + Vite
- React Router (`HashRouter`, compatible con GitHub Pages)
- Tailwind CSS v4
- Sin backend, sin API keys, sin dependencias externas obligatorias

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview del build

```bash
npm run preview
```

## Validar el banco de preguntas

```bash
npm run validate-questions
```

Verifica IDs duplicados, campos faltantes, y valores inválidos de `domain`/`approach`/`difficulty`.

## Deploy en GitHub Pages

Este repo incluye `.github/workflows/deploy.yml`, que publica automáticamente en cada
push a `main`.

Pasos:

1. Crea el repositorio en GitHub (ya hecho: `Luis321/PMPstrategic`).
2. Sube el proyecto (`git push origin main`).
3. En GitHub → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Cada push a `main` dispara el workflow y publica en:
   `https://luis321.github.io/PMPstrategic/`

Si renombras el repositorio, actualiza `REPO_NAME` en `vite.config.ts`.

Ver más detalle en [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Arquitectura

Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Metodología de estudio

Ver [`docs/STUDY-METHODOLOGY.md`](docs/STUDY-METHODOLOGY.md).

## Esquema de preguntas

Ver [`docs/QUESTION-SCHEMA.md`](docs/QUESTION-SCHEMA.md).

## PMP Mindset

Ver [`docs/PMP-MINDSET.md`](docs/PMP-MINDSET.md).

## Persistencia y backup

Todo el progreso (respuestas, sesiones, error log, plan de estudio, configuración) se
guarda en `localStorage` bajo la clave `pmp-mastery-lab:data`. Desde **Settings**
puedes:

- **Export Progress**: descarga `pmp-mastery-backup.json`.
- **Import Progress**: sube un backup previo (se valida su estructura antes de reemplazar tus datos).
- **Reset Data**: borra todo y vuelve al estado inicial.

## Cómo agregar nuevas preguntas

1. Usa el prompt en [`docs/question-generator-prompt.md`](docs/question-generator-prompt.md) con un capítulo de tu guía PMBOK.
2. Pega las preguntas generadas dentro del array `questions` en `src/data/questions.ts`.
3. Corre `npm run validate-questions`.
4. Corre `npm run build` para confirmar que compila.

Banco actual: **25 preguntas** (meta: 150–250). Ver la nota al final de `src/data/questions.ts`.

## Cómo modificar la ruta de estudio

La ruta de 8 semanas se genera en `src/services/studyPlanGenerator.ts`
(`WEEK_TEMPLATES`). Puedes editar objetivos, temas, lecturas recomendadas y la
distribución de sesiones diarias ahí. El usuario puede regenerar la ruta desde la
pantalla **Study Plan**, ajustando fecha de examen y horas disponibles por semana.

## Troubleshooting

**La app carga en blanco al abrir el `.html` directamente desde el disco.**
Vite necesita servir la app (`npm run dev` o `npm run preview`), o publicarla vía GitHub Pages. Abrir `index.html` con `file://` no funciona por las rutas absolutas generadas en el build.

**El routing no funciona en GitHub Pages (404 en subrutas).**
La app usa `HashRouter` específicamente para evitar este problema. Si cambias a `BrowserRouter`, necesitarás un `404.html` que redirija a `index.html`.

**El build falla con errores de TypeScript.**
Corre `npx tsc -b --noEmit` para ver el detalle. Revisa que cualquier pregunta nueva agregada a `questions.ts` cumpla el tipo `Question` (usa `npm run validate-questions` primero).

**Mi progreso desapareció.**
El progreso vive en `localStorage` de un navegador/dispositivo específico. Si cambiaste de navegador, borraste datos del sitio, o usaste modo incógnito, no persiste. Por eso se recomienda exportar tu progreso regularmente desde **Settings**.
