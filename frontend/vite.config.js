import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:8080",
      "/maintenance": "http://localhost:8080",
      "/drills": "http://localhost:8080",
      "/dashboard": "http://localhost:8080",
    },
  },
});