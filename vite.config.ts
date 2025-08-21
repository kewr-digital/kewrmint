import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 2222,
    host: "0.0.0.0",
    strictPort: true,
    hmr: {
      port: 2222,
    },
  },
  preview: {
    port: 2222,
    host: "0.0.0.0",
  },
});
