import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import https from "node:https";

export default defineConfig({
  plugins: [handlebars({ partialDirectory: resolve(import.meta.dirname, "src/partials") })],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["import", "mixed-decls", "color-functions", "global-builtin"],
      },
    },
  },
  server: {
    // Proxy để tránh CORS khi chạy localhost; khớp VITE_API_URL=/api
    proxy: {
      "/api": {
        target: "https://api-uat.vinhomes.biz.vn",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "/hovixi/api/v1"),
        agent: new https.Agent({ keepAlive: false }),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        projectDetail: resolve(import.meta.dirname, "project-detail.html"),
      },
    },
  },
});
