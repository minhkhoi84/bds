import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

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
    proxy: {
      "/api": {
        target: "https://chua-co-backend.com", // điền base URL thật khi có backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      input: { main: resolve(import.meta.dirname, "index.html") },
    },
  },
});