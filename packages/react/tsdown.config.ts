import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/*/index.ts',
    './src/*/index.tsx',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
})
