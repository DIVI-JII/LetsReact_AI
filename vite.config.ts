import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the API runs on :3000. Proxying keeps the browser on a single origin,
// exactly like production, so cookies and CSRF checks behave the same way.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
      },
    },
  },
});
