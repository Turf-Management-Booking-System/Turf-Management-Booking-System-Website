import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/', // This ensures assets load correctly on Render
    server: {
    historyApiFallback: true, // For dev server
  },
})
