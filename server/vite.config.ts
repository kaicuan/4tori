import build from "@hono/vite-build/vercel";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, ".."),
  resolve: {
    alias: {
      "@4tori/shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  plugins: [
    build({
      entry: "server/src/app.ts",
    }),
  ],
});
