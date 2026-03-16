import { defineConfig } from 'vitest/config';
import eslint from 'vite-plugin-eslint2';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    eslint({ overrideConfigFile: './eslint.config.js' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
  },
});