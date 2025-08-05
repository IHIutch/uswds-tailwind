import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: 'dist',
  dts: true,
})
