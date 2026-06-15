import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      }
    }),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:54321/functions/v1',
        changeOrigin: true,
        secure: false,
      },
      '/supabase': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
      }
    }
  },
})
