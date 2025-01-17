import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
      rollupOptions: {
          output: {
              dir: 'dist/assets/',
              entryFileNames: 'heartsteel.js',
              assetFileNames: 'heartsteel.css',
              chunkFileNames: "chunk.js",
              manualChunks: undefined,
          }
      }
  }
})
