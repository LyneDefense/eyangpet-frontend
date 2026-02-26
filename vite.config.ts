import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/eyangpet/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/eyangpet/api': {
        target: 'http://localhost:9909',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/eyangpet\/api/, '/api')
      }
    }
  }
})
