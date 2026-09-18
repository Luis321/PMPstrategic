# DEPLOYMENT.md

## Requisitos

- Node.js 20+ (el workflow de CI usa Node 20).
- Una cuenta de GitHub con el repositorio `Luis321/PMPstrategic` ya creado (privado).

## Deploy automático (recomendado)

El repo incluye `.github/workflows/deploy.yml`, que:

1. Se dispara en cada `push` a `main` (o manualmente vía `workflow_dispatch`).
2. Instala dependencias (`npm ci`).
3. Corre `npm run build`.
4. Publica el contenido de `dist/` como GitHub Pages usando `actions/deploy-pages`.

### Pasos exactos

1. **Activar GitHub Pages en modo Actions**:
   GitHub → tu repo → **Settings** → **Pages** → en "Build and deployment" →
   **Source: GitHub Actions**.

2. **Confirmar el nombre del repo en `vite.config.ts`**:
   ```ts
   const REPO_NAME = 'PMPstrategic'
   ```
   Esto determina el `base` path del build (`/PMPstrategic/`), necesario para que
   los assets carguen correctamente en `https://luis321.github.io/PMPstrategic/`.
   Si renombras el repositorio, actualiza este valor y vuelve a hacer push.

3. **Push a `main`**:
   ```bash
   git add .
   git commit -m "Deploy PMP Mastery Lab"
   git push origin main
   ```

4. El workflow corre automáticamente. Puedes verlo en la pestaña **Actions** del repo.

5. Una vez termine (ícono verde ✅), la app estará en:
   `https://luis321.github.io/PMPstrategic/`

## Deploy manual (alternativa, sin Actions)

Si prefieres no usar GitHub Actions:

```bash
npm run build
npm install -g gh-pages   # una sola vez
npx gh-pages -d dist
```

Esto publica `dist/` directamente a la rama `gh-pages`. En ese caso, configura
**Settings → Pages → Source: Deploy from a branch → gh-pages**.

## Verificación post-deploy

Checklist rápido una vez publicado:

- [ ] La app carga en la URL de GitHub Pages (no en blanco, no 404).
- [ ] El routing funciona al navegar entre secciones (Dashboard, Practice, etc.) — gracias a `HashRouter`, las URLs se ven como `.../#/practice`.
- [ ] Recargar la página en cualquier sección no rompe la app (otra ventaja de `HashRouter`).
- [ ] El modo oscuro/claro persiste al recargar.
- [ ] Responder preguntas y recargar conserva el progreso (verifica `localStorage`).
- [ ] Export Progress descarga un `.json` válido.

## Notas sobre el repo privado

Como `PMPstrategic` es un repositorio **privado**, GitHub Pages para repos privados
requiere **GitHub Pro, Team o Enterprise** (no está disponible en el plan gratuito
para páginas de repos privados, salvo cuentas de organización con GitHub Team/Enterprise).
Si tu cuenta es Free y el repo es privado, tienes dos opciones:
1. Hacer el repositorio público (dado que no contiene secretos ni API keys, esto es seguro).
2. Mantenerlo privado y usar un plan de GitHub que soporte Pages privado.
