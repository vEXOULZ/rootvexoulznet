import { execSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/** The commit this build comes from, shown in the footer (empty outside a git checkout). */
function commit(): string {
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return process.env.GITHUB_SHA ?? ''
  }
}

export default defineConfig({
  define: { __COMMIT__: JSON.stringify(commit()) },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
