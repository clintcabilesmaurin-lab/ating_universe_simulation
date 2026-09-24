import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@floot/realtime': path.resolve(__dirname, './floot-realtime/index.ts'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
