import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-page/editor': path.resolve(
        __dirname,
        '../../packages/editor'
      ),
      '@react-page/plugins-background': path.resolve(
        __dirname,
        '../../packages/plugins/background'
      ),
      '@react-page/plugins-divider': path.resolve(
        __dirname,
        '../../packages/plugins/divider'
      ),
      '@react-page/plugins-html5-video': path.resolve(
        __dirname,
        '../../packages/plugins/html5-video'
      ),
      '@react-page/plugins-image': path.resolve(
        __dirname,
        '../../packages/plugins/image'
      ),
      '@react-page/plugins-spacer': path.resolve(
        __dirname,
        '../../packages/plugins/spacer'
      ),
      '@react-page/plugins-video': path.resolve(
        __dirname,
        '../../packages/plugins/video'
      ),
      '@react-page/plugins-slate': path.resolve(
        __dirname,
        '../../packages/plugins/content/slate'
      ),
    },
  },
  optimizeDeps: {
    include: [
      '@react-page/editor',
      '@react-page/plugins-background',
      '@react-page/plugins-divider',
      '@react-page/plugins-html5-video',
      '@react-page/plugins-image',
      '@react-page/plugins-spacer',
      '@react-page/plugins-video',
      '@react-page/plugins-slate',
    ],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', '../..'],
    },
    host: true, // Listen on all addresses
  },
});
