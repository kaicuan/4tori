import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import build from "@hono/vite-build/vercel";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  if (mode === "server") {
    return {
      plugins: [
        build({
          entry: "./server/app.ts",
        }),
      ],
    };
  }

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "client/routes",
        generatedRouteTree: "client/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "client",
        filename: "sw.ts",
        registerType: "autoUpdate",
        injectRegister: false,
        pwaAssets: {
          disabled: false,
          config: true,
        },
        manifest: {
          name: "4tori",
          short_name: "4tori",
          description: "4tori",
          theme_color: "#ffffff",
        },
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        },
        devOptions: {
          enabled: false,
          navigateFallback: "index.html",
          suppressWarnings: true,
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client"),
      },
    },
    build: {
      outDir: ".vercel/output/static",
      emptyOutDir: false,
    },
    server: {
      proxy: { "/api": `http://localhost:3000` },
    },
  };
});
