import { execFileSync } from 'node:child_process'
import { appendFileSync, globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
if (args.some(arg => arg !== '--dry-run'))
  throw new Error('Usage: node scripts/promote-beta.mjs [--dry-run]')

const dryRun = args.includes('--dry-run')
const root = fileURLToPath(new URL('../', import.meta.url))
const packages = [...globSync('packages/**/package.json', {
  cwd: root,
  exclude: path => path.split(/[\\/]/).some(part => part === 'node_modules' || part === 'dist'),
})]
  .map(path => JSON.parse(readFileSync(join(root, path), 'utf8')))
  .filter(pkg => !pkg.private && pkg.name?.startsWith('@uswds-tailwind/'))
  .sort((a, b) => a.name.localeCompare(b.name))

if (!packages.length)
  throw new Error('No public packages found')

// Validate every package before changing any tags, including on publish retries.
for (const pkg of packages) {
  if (!/^2\.0\.0-beta\.\d+$/.test(pkg.version))
    throw new Error(`Expected a V2 beta version for ${pkg.name}, received ${pkg.version}`)
}

if (!dryRun) {
  for (const pkg of packages) {
    for (let attempt = 1; attempt <= 12; attempt++) {
      let version
      try {
        version = JSON.parse(execFileSync('npm', [
          'view',
          `${pkg.name}@${pkg.version}`,
          'version',
          '--json',
          '--prefer-online',
          '--fetch-retries=0',
          '--fetch-timeout=10000',
        ], { encoding: 'utf8', cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }))
      }
      catch (error) {
        // Retry registry propagation delays, not authentication or permission errors.
        if (!error.stderr?.toString().includes('E404'))
          throw error
      }
      if (version === pkg.version)
        break
      if (attempt === 12)
        throw new Error(`${pkg.name}@${pkg.version} is not visible on npm after 12 attempts`)
      console.log(`Waiting for ${pkg.name}@${pkg.version} on npm (${attempt}/12)`)
      await setTimeout(10000)
    }
  }
}

for (const pkg of packages) {
  const args = ['dist-tag', 'add', `${pkg.name}@${pkg.version}`, 'latest']
  console.log(`npm ${args.join(' ')}`)
  if (!dryRun)
    execFileSync('npm', args, { stdio: 'inherit', cwd: root })
}

// Pass the successfully promoted versions to the following GitHub release step.
if (!dryRun && process.env.GITHUB_OUTPUT) {
  const tags = packages.map(pkg => `${pkg.name}@${pkg.version}`)
  appendFileSync(process.env.GITHUB_OUTPUT, `packages=${JSON.stringify(tags)}\n`)
}
