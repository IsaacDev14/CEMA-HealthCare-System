import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',  // Bind to all network interfaces
    port: 4173,        // Ensure this is the correct port
    cors: true,        // Enable CORS for cross-origin requests
    strictPort: true,  // Fail if the specified port is occupied
  },
  preview: {
    allowedHosts: ['https://cema-healthcare-system-1.onrender.com'],  // Add your host here
    open: true,         // Automatically open the app in the browser when previewing
  },
  optimizeDeps: {
    force: true,       // Force dependency optimization if necessary
  },
  base: '/',           // Set base path for your app if needed (for deployment)
})
