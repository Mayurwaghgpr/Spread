import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    host: true,
    port: 5173,
  },

  build: {
    outDir: "dist", // Configure the output directory
  },
  plugins: [react()],
});
