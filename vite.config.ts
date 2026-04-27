import path from "path"
import reactSWC from '@vitejs/plugin-react-swc'
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [reactSWC()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})