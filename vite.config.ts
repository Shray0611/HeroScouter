import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { configureApiMiddleware } from './server/api.js'

// Vite config - https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    minify: true,
  },
  plugins: [
    heroscouterApiPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
  },
})

function heroscouterApiPlugin(): Plugin {
  return {
    name: 'heroscouter-api',
    apply: 'serve',
    configureServer(server) {
      configureApiMiddleware(server.middlewares)
    },
  }
}
