import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',  // Bind to all network interfaces
    port: 4173,        // Ensure this is the correct port
  },
  preview: {
    allowedHosts: ['cema-healthcare-system-1.onrender.com']  // Add your host here
  }
})
