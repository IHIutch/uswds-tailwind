import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    globals: true,
    testTimeout: 1000,
    setupFiles: ['./test/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
    browser: {
      provider: playwright({
        // https://vitest.dev/guide/browser/playwright
        launchOptions: {
          channel: 'chromium',
        },
      }),
      enabled: true,
      headless: !!process.env.CI,
      instances: [{
        browser: 'chromium',
        testerHtmlPath: './test/browser-document.html',
        viewport: { width: 640, height: 360 },
      }],
    },
  },
})
