import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path matches the GitHub repo name: https://<user>.github.io/PMPstrategic/
// Change REPO_NAME below if the repository is renamed.
const REPO_NAME = 'PMPstrategic'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
})
