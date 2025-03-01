import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-page/editor': path.resolve(__dirname, '../../packages/editor/lib'),
      // Add other packages as needed
    },
  },
  optimizeDeps: {
    include: ['@react-page/editor'],
    exclude: [
      '@react-page/plugins-background',
      '@react-page/plugins-divider',
      '@react-page/plugins-html5-video',
      '@react-page/plugins-image',
      '@react-page/plugins-spacer',
      '@react-page/plugins-video',
    ],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', '../..'],
    },
  },
})
