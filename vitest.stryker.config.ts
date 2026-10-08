import { readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vitest/config'
import base from './vitest.config'

// Used by stryker.config.mjs; reads the same STRYKER_PACKAGE and STRYKER_E2E variables.
const pkg = process.env.STRYKER_PACKAGE
if (!pkg)
  throw new Error('Set STRYKER_PACKAGE to a directory under packages/machines, e.g. date-picker-compat')
const e2e = process.env.STRYKER_E2E?.split(',') ?? [pkg.replace(/-compat$/, '')]
const dir = new URL(`./packages/machines/${pkg}/`, import.meta.url)
const { name } = JSON.parse(readFileSync(new URL('package.json', dir), 'utf8'))

const config = mergeConfig(base, {
  // Tests import the built package; point it at src/ so the mutations run.
  resolve: { alias: { [name]: fileURLToPath(new URL('src/index.ts', dir)) } },
})
// mergeConfig appends arrays, which would keep every component's e2e.
config.test!.include = e2e.map(dir => `e2e/${dir}/**/*.test.ts`)

export default config
