import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true, // Borra archivos viejos en dist antes de compilar
  },
  clearScreen: false // Muestra más logs al ejecutar npm run dev
});
