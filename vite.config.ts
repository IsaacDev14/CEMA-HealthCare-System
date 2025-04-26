import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    cors: true,
    strictPort: true,
  },
  preview: {
    allowedHosts: ['cema-healthcare-system-1.onrender.com'], // Updated
    open: true,
  },
  optimizeDeps: {
    force: true,
  },
  base: '/',
});