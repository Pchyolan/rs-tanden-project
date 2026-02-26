import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['node_modules', 'dist', '*.config.js', 'webpack/*.js'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            unicorn,
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            unicorn.configs.recommended,
            prettier,
        ],
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                { assertionStyle: 'never' },
            ],
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-unused-vars': ['error'],
            'unicorn/no-array-callback-reference': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/no-null': 'off',
            'unicorn/number-literal-case': 'off',
            'unicorn/prefer-event-target': 'off',
            'unicorn/numeric-separators-style': 'off',
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    allowList: {
                        acc: true,
                        env: true,
                        i: true,
                        j: true,
                        props: true,
                        Props: true,
                    },
                },
            ],
            'max-lines-per-function': ['error', 40],
            'no-console': 'off',
            'no-plusplus': 'off',
        },
    },
    {
        files: ['src/core/base-component.ts'],
        rules: {
            '@typescript-eslint/consistent-type-assertions': 'off',
        },
    },
    {
        files: ['vite.config.ts', '*.config.js', '*.config.ts'],
        extends: [tseslint.configs.disableTypeChecked],
        languageOptions: {
            parserOptions: {
                project: false
            }
        }
    }
]);