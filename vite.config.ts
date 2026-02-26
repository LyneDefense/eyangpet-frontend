import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:9909'

  return {
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
          target: apiTarget,
          changeOrigin: true,
          // 如果是本地开发地址，则需要重写路径（去掉 /eyangpet 前缀）
          // 如果是公网地址，根据您的描述，公网地址本身包含 /eyangpet，所以不需要重写
          rewrite: (path) => {
            if (apiTarget.includes('localhost')) {
              return path.replace(/^\/eyangpet\/api/, '/api')
            }
            return path
          }
        }
      }
    }
  }
})
