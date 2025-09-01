import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['e2e/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.storybook/**',
      'packages/**/test-patterns/**',
    ],
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
