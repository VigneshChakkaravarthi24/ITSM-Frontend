import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',  // Use relative paths in production
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,  // Allow fallback ports in development
    cors: false,
  },
  build: {
    outDir: 'dist',  // Ensure Electron loads the build files from 'dist'
  }
});
