import process from 'node:process'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({

  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['github-actions'] : ['dot'],

    testTimeout: 5000,
    globals: true,
    include: ['e2e/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.storybook/**',
    ],
    browser: {
      provider: playwright(),
      headless: !!process.env.GITHUB_ACTIONS,
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
