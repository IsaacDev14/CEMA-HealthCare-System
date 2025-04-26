import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    cors: true,
    strictPort: false, // Allow Vite to use another port if 4173 is taken
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: ['cema-healthcare-system-1.onrender.com'],
    open: true,
    strictPort: false, // Add this to preview as well
  },
  optimizeDeps: {
    force: true,
  },
  base: '/',
});