import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = (env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        // Proxy API calls to backend to avoid CORS in development
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
