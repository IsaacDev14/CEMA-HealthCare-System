import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/', // Required for Vercel
  build: {
    outDir: 'dist', // Explicitly set output directory
    sourcemap: true, // Optional: for debugging
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173, // Vite default port
    cors: true,
    strictPort: false,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    strictPort: false,
    open: true,
  },
  optimizeDeps: {
    force: true,
  },
});