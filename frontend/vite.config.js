import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/': {
        target: 'http://localhost:5174',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/admin/, '')
      },
      '/dashboard': {
        target: 'http://localhost:5176',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dashboard/, '')
      }
    }
  }
})
