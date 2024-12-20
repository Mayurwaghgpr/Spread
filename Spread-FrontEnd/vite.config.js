import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000/",
    },
  },
  build: {
    outDir: "dist", // Configure the output directory
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "other-libraries"], // Example for vendor libraries
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
});
