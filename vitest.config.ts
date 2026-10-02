import process from 'node:process'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const allBrowsers = !!process.env.GITHUB_ACTIONS || process.env.E2E_BROWSERS === 'all'

export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['github-actions'] : ['dot'],
    include: ['e2e/**/*.{test,spec}.ts'],
    tags: [
      { name: 'legacy', description: 'Tests migrated from the USWDS source test suite.' },
      { name: 'parity', description: 'Repo-original tests that hold the component to USWDS behavior.' },
      { name: 'new', description: 'Tests for functionality that only the ported version has.' },
    ],
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [
        { browser: 'chromium' },
        ...(allBrowsers ? [{ browser: 'firefox' as const }, { browser: 'webkit' as const }] : []),
      ],
    },
  },
})
