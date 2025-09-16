import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/init-all.ts',
    './src/init-auto.ts',
    './src/accordion.ts',
    './src/character-count.ts',
    './src/collapse.ts',
    './src/combobox.ts',
    './src/date-picker.ts',
    './src/date-range-picker.ts',
    './src/dropdown.ts',
    './src/file-input.ts',
    './src/input-mask.ts',
    './src/modal.ts',
    './src/table.ts',
  ],
  outDir: 'dist',
  dts: true,
})