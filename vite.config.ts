import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This sets the base path to relative (./).
  // This allows the app to be deployed to https://username.github.io/repo-name/
  // without needing to know the exact repo name beforehand.
  base: './', 
})