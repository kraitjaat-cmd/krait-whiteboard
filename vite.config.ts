import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Using relative path so it runs seamlessly on GitHub Pages (e.g. krait-whiteboard) and any root/subpath
  plugins: [react()],
})
