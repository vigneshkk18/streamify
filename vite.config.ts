import path from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("@vidstack")) {
            return "@vidstack";
          }
          if (id.includes("socket.io")) {
            return "socket.io";
          }
          if (id.includes("react-file-drop")) {
            return "react-file-drop";
          }
          if (id.includes("@radix-ui")) {
            return "@radix-ui";
          }
          if (id.includes("src")) {
            return "@core";
          }
          return "rest-vendors";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
