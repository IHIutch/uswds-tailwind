import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    outputDir: "./e2e/results",
    testMatch: "*.e2e.ts",
    timeout: 30000,
    retries: 2,
    webServer: {
        cwd: "./examples/vanilla-ts",
        command: "PORT=3000 pnpm dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
    },
    use: {
        baseURL: 'http://localhost:5173', // Replace with the actual base URL
        headless: false,
    },
});
