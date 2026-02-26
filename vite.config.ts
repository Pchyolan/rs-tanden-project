import { defineConfig } from 'vitest/config';
import eslint from 'vite-plugin-eslint2';

export default defineConfig({
    plugins: [
        eslint({ overrideConfigFile: './eslint.config.js' })
    ],
    resolve: {
        alias: {
            '@': new URL('src', import.meta.url).pathname,
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