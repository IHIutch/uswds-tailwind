import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

// GitHub imports contain only this example directory, so workspace/catalog
// specifiers must be replaced before StackBlitz installs dependencies.
const catalogVersions = {
  '@fontsource-variable/merriweather': '^5.2.6',
  '@fontsource-variable/open-sans': '^5.2.7',
  '@fontsource-variable/public-sans': '^5.2.7',
  '@fontsource-variable/roboto-mono': '^5.2.8',
  '@fontsource-variable/source-sans-3': '^5.2.9',
  '@iconify-json/fa-solid': '^1.2.2',
  '@iconify-json/fa6-brands': '1.2.6',
  '@iconify-json/material-symbols': '1.2.42',
  '@tailwindcss/vite': '4.3.3',
  'tailwindcss': '4.3.3',
  'typescript': '^5.9.3',
  'vite': '7.2.7',
}

async function main() {
  const filename = process.argv[2] ?? './package.json'
  const { version: releaseVersion } = JSON.parse(
    await readFile(new URL('./stackblitz-release.json', import.meta.url), 'utf8'),
  )
  const packageJson = JSON.parse(await readFile(filename, 'utf8'))

  for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, version] of Object.entries(packageJson[section] ?? {})) {
      if (version.startsWith('workspace:') || version.startsWith('link:')) {
        if (!name.startsWith('@uswds-tailwind/')) {
          throw new Error(`Unexpected local dependency: ${name}`)
        }
        packageJson[section][name] = releaseVersion
      }
      else if (version === 'catalog:') {
        const publishedVersion = catalogVersions[name]
        if (!publishedVersion) {
          throw new Error(`Missing catalog version for ${name}`)
        }
        packageJson[section][name] = publishedVersion
      }
    }
  }

  await writeFile(filename, `${JSON.stringify(packageJson, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
