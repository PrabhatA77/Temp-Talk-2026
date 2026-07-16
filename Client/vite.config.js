import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // REST API calls
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
      // WebSocket connections
      "/ws": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        ws: true, // tells Vite this is a WS proxy, not plain HTTP
        secure: false,
      },
    },
  },
})
