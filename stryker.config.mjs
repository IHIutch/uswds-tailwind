// Mutation testing for one machine package against its e2e tests.
// Usage: STRYKER_PACKAGE=date-picker-compat [STRYKER_E2E=date-picker,date-range-picker] pnpm test:mutation
// Run `pnpm build:packages` first: only the mutated package is read from src/.
import process from 'node:process'

const pkg = process.env.STRYKER_PACKAGE
if (!pkg)
  throw new Error('Set STRYKER_PACKAGE to a directory under packages/machines, e.g. date-picker-compat')

export default {
  testRunner: 'vitest',
  // pnpm keeps the runner out of Stryker's default plugin lookup.
  plugins: ['@stryker-mutator/vitest-runner'],
  vitest: { configFile: 'vitest.stryker.config.ts' },
  mutate: [`packages/machines/${pkg}/src/**/*.ts`],
  // Stryker otherwise rewrites every matching file in place, which drops executable bits.
  disableTypeChecks: false,
  // Blanked labels and keys are most of the noise and a large share of the runtime.
  mutator: { excludedMutations: ['StringLiteral'] },
  // Mutates the source files in place and restores them at the end (backup in .stryker-tmp).
  inPlace: true,
  concurrency: 4,
  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: { fileName: `reports/mutation/${pkg}.html` },
  jsonReporter: { fileName: `reports/mutation/${pkg}.json` },
}
