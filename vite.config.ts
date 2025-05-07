import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    open: true, // Automatically open browser
    port: 3000, // Default port
  }
})
