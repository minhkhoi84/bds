import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'node:https';

export default defineConfig({
  plugins: [react()],
  server: {
    // Tránh CORS khi chạy localhost: /api/... -> https://api-uat.vinhomes.biz.vn/hovixi/api/v1/...
    proxy: {
      '/api': {
        target: 'https://api-uat.vinhomes.biz.vn',
        changeOrigin: true,
        // Không giữ kết nối cũ: tránh lỗi khi backend đã đóng socket keep-alive
        agent: new https.Agent({ keepAlive: false }),
        rewrite: (p) => p.replace(/^\/api/, '/hovixi/api/v1'),
      },
    },
  },
});