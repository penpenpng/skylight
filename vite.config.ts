import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/skylight/",
  plugins: [vue()],
  build: {
    outDir: ".",
  },
  resolve: {
    alias: {
      "@/": `${__dirname}/src/`,
    },
  },
});
