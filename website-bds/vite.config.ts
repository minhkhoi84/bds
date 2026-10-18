import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Tránh CORS khi chạy localhost: /api/... -> https://api-uat.vinhomes.biz.vn/hovixi/api/v1/...
    proxy: {
      '/api': {
        target: 'https://api-uat.vinhomes.biz.vn',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/hovixi/api/v1'),
      },
    },
  },
});