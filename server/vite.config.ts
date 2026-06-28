import build from "@hono/vite-build/vercel";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
