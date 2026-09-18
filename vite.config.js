import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto local para desarrollo
    open: true  // Abre el navegador automáticamente al iniciar
  },
  build: {
    outDir: 'dist', // Carpeta de salida para producción
    sourcemap: true, // Útil para depurar en producción si hay errores
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          icons: ['lucide-react']
        }
      }
    }
  }
})