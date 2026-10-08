// Delete one piece of a machine package at a time, rebuild it, rerun its tests,
// and report which deletions no test catches.
//
// Usage: node scripts/deletion-sweep.mjs <config.mjs> [--only id,id] [--json results.json]
//
// The config module default-exports:
//   {
//     package: '@uswds-tailwind/date-picker-compat', // rebuilt after every edit; e2e reads dist/
//     e2e: ['e2e/date-picker'],                       // root vitest filters
//     react: ['date-picker'],                         // packages/react vitest filters
//     mutations: [
//       { id, description, edits: [{ file, find, replace = '', count = 1 }] },
//     ],
//     groups: [{ id, description, ids: ['mutation-id', ...] }], // applied in order
//   }
//
// A deletion counts as caught only when it fails a test that passed in the
// baseline run, so suites with known failures still work. Sources are restored
// from memory after every run, never with git checkout, so uncommitted work is safe.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const usage = 'Usage: node scripts/deletion-sweep.mjs <config.mjs> [--only id,id] [--json results.json]'
const args = process.argv.slice(2)
const configPath = args[0]
if (!configPath || configPath.startsWith('--'))
  throw new Error(usage)
let only
let jsonPath
for (let i = 1; i < args.length; i += 2) {
  if (args[i] === '--only')
    only = new Set(args[i + 1]?.split(','))
  else if (args[i] === '--json')
    jsonPath = resolve(args[i + 1] ?? '')
  else
    throw new Error(usage)
}

const root = fileURLToPath(new URL('../', import.meta.url))
const config = (await import(pathToFileURL(resolve(configPath)).href)).default
if (!config?.package || !config.mutations?.length)
  throw new Error('Config must export { package, mutations }')
if (!config.e2e?.length && !config.react?.length)
  throw new Error('Config must list e2e or react test filters')

const mutations = new Map(config.mutations.map(m => [m.id, m]))
const trials = [
  ...config.mutations,
  ...(config.groups ?? []).map(group => ({
    ...group,
    edits: group.ids.flatMap((id) => {
      if (!mutations.has(id))
        throw new Error(`Group ${group.id} names unknown mutation ${id}`)
      return mutations.get(id).edits
    }),
  })),
].filter(trial => !only || only.has(trial.id))

const originals = new Map()
for (const trial of trials) {
  for (const edit of trial.edits) {
    if (!originals.has(edit.file))
      originals.set(edit.file, readFileSync(join(root, edit.file), 'utf8'))
  }
}

function applyEdits(edits) {
  const files = new Map(originals)
  for (const { file, find, replace = '', count = 1 } of edits) {
    const source = files.get(file)
    const found = source.split(find).length - 1
    if (found !== count)
      throw new Error(`Expected ${count} match(es) in ${file}, found ${found}:\n${find}`)
    files.set(file, source.replaceAll(find, replace))
  }
  return files
}

// Check every pattern before touching any file.
const failedChecks = trials.flatMap((trial) => {
  try {
    applyEdits(trial.edits)
    return []
  }
  catch (error) {
    return [`[${trial.id}] ${error.message}`]
  }
})
if (failedChecks.length)
  throw new Error(`Patterns do not match the current source:\n${failedChecks.join('\n')}`)

function writeFiles(files) {
  for (const [file, source] of files)
    writeFileSync(join(root, file), source)
}

function run(command, commandArgs, cwd) {
  return spawnSync(command, commandArgs, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
}

const outputDir = mkdtempSync(join(tmpdir(), 'deletion-sweep-'))

function runVitest(name, cwd, filters) {
  if (!filters?.length)
    return { failed: [], passed: 0 }
  const outputFile = join(outputDir, `${name}.json`)
  rmSync(outputFile, { force: true })
  const result = run('pnpm', ['vitest', 'run', ...filters, '--reporter=json', `--outputFile=${outputFile}`], cwd)
  if (!existsSync(outputFile))
    return { error: `${name} tests did not report:\n${(result.stdout + result.stderr).slice(-2000)}` }
  const report = JSON.parse(readFileSync(outputFile, 'utf8'))
  const failed = []
  let passed = 0
  for (const file of report.testResults) {
    for (const test of file.assertionResults) {
      if (test.status === 'passed')
        passed++
      else if (test.status === 'failed')
        failed.push(`${relative(root, file.name)} > ${test.fullName}`)
    }
  }
  // A file that fails to load reports no assertions.
  for (const file of report.testResults) {
    if (file.status === 'failed' && !file.assertionResults.length)
      failed.push(`${relative(root, file.name)} (did not load)`)
  }
  return { failed, passed }
}

function runSuites() {
  const build = run('pnpm', ['--filter', config.package, 'build'], root)
  if (build.status !== 0)
    return { error: `Build failed:\n${(build.stdout + build.stderr).slice(-2000)}` }
  const e2e = runVitest('e2e', root, config.e2e)
  const react = runVitest('react', join(root, 'packages/react'), config.react)
  const error = e2e.error ?? react.error
  if (error)
    return { error }
  return { failed: [...e2e.failed, ...react.failed], passed: e2e.passed + react.passed }
}

function restore() {
  writeFiles(originals)
}

process.on('SIGINT', () => {
  restore()
  run('pnpm', ['--filter', config.package, 'build'], root)
  process.exit(130)
})

const results = []
try {
  const baseline = runSuites()
  if (baseline.error)
    throw new Error(`Baseline run failed. ${baseline.error}`)
  const baselineFailed = new Set(baseline.failed)
  console.log(`Baseline: ${baseline.passed} passed, ${baseline.failed.length} failed\n`)

  for (const trial of trials) {
    writeFiles(applyEdits(trial.edits))
    const outcome = runSuites()
    restore()
    const newFailures = outcome.failed?.filter(test => !baselineFailed.has(test)) ?? []
    const status = outcome.error ? 'ERROR' : newFailures.length ? 'CAUGHT' : 'SURVIVES'
    results.push({ id: trial.id, description: trial.description, status, newFailures, error: outcome.error })
    console.log(`[${trial.id}] ${status}: ${trial.description}`)
    for (const line of outcome.error ? [outcome.error.split('\n')[0]] : newFailures)
      console.log(`    ${line}`)
  }
}
finally {
  restore()
  const rebuild = run('pnpm', ['--filter', config.package, 'build'], root)
  if (rebuild.status !== 0)
    console.error(`Rebuilding ${config.package} from the restored source failed`)
  rmSync(outputDir, { recursive: true, force: true })
}

console.log('\nSummary')
for (const result of results)
  console.log(`${result.status.padEnd(9)} ${result.id.padEnd(24)} ${result.description}`)
if (jsonPath)
  writeFileSync(jsonPath, `${JSON.stringify(results, null, 2)}\n`)
