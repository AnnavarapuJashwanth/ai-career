import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Drei's Stats component depends on stats.js (CJS). We don't use it, so stub it.
      'stats.js': path.resolve(__dirname, 'src/shims/stats.js'),
      // Some Drei internals pull in prop-types (CJS). Use a lightweight ESM shim.
      'prop-types': path.resolve(__dirname, 'src/shims/prop-types.js'),
    },
  },
  optimizeDeps: {
    // Avoid dev-time 504 "Outdated Optimize Dep" on heavy 3D bundle
    exclude: ['@react-three/drei'],
  },
})
