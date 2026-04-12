import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5130',   // Port backend của bạn
        changeOrigin: true,
        secure: false,
      }
    }
  }
})