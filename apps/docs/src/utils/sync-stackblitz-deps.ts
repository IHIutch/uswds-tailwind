import fs from 'node:fs'
import path from 'node:path'

/**
 * Reads the vanilla-ts example package.json and converts it to StackBlitz-compatible dependencies
 */
export function getStackBlitzDependencies() {
  try {
    // Read the vanilla-ts package.json
    const packageJsonPath = path.resolve('../../examples/vanilla-ts/package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // Read the workspace catalog for version resolution
    const workspaceCatalog = getWorkspaceCatalog()

    // Convert catalog: and workspace: references to actual versions
    const convertedDeps = convertDependencies(packageJson.dependencies, workspaceCatalog)
    const convertedDevDeps = convertDependencies(packageJson.devDependencies, workspaceCatalog)

    return {
      dependencies: convertedDeps,
      devDependencies: convertedDevDeps,
    }
  }
  catch (error) {
    console.warn('Failed to read vanilla-ts package.json, using fallback dependencies:', error)
    return getFallbackDependencies()
  }
}

/**
 * Reads the pnpm-workspace.yaml catalog for version resolution
 */
function getWorkspaceCatalog(): Record<string, string> {
  try {
    const workspacePath = path.resolve('../../pnpm-workspace.yaml')
    const workspaceContent = fs.readFileSync(workspacePath, 'utf-8')

    // Simple parser for the catalog section
    const catalogSection = extractCatalogSection(workspaceContent)
    return catalogSection
  }
  catch (error) {
    console.warn('Failed to read workspace catalog:', error)
    return {}
  }
}

/**
 * Extracts the catalog section from pnpm-workspace.yaml content
 */
function extractCatalogSection(content: string): Record<string, string> {
  const catalog: Record<string, string> = {}
  const lines = content.split('\n')
  let inCatalogSection = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === 'catalog:') {
      inCatalogSection = true
      continue
    }

    // Stop if we hit another top-level section
    if (inCatalogSection && /^[a-z]/i.test(line)) {
      break
    }

    // Parse catalog entries
    if (inCatalogSection && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex > 0) {
        const packageName = trimmed.slice(0, colonIndex).replace(/^["']|["']$/g, '')
        const version = trimmed.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
        catalog[packageName] = version
      }
    }
  }

  return catalog
}

/**
 * Converts catalog: and workspace: references to actual version ranges
 */
function convertDependencies(deps: Record<string, string>, catalog: Record<string, string>) {
  const converted: Record<string, string> = {}

  for (const [name, version] of Object.entries(deps)) {
    if (version === 'catalog:') {
      // Use version from workspace catalog
      converted[name] = catalog[name] || 'beta'
    }
    else if (version.startsWith('workspace:')) {
      // Convert workspace dependencies to latest published versions
      converted[name] = 'beta'
    }
    else {
      // Keep existing version as-is
      converted[name] = version
    }
  }

  return converted
}

/**
 * Fallback dependencies when vanilla-ts package.json can't be read
 */
function getFallbackDependencies() {
  return {
    dependencies: {
      '@fontsource-variable/merriweather': '^5.2.4',
      '@fontsource-variable/open-sans': '^5.2.6',
      '@fontsource-variable/public-sans': '^5.2.6',
      '@fontsource-variable/roboto-mono': '^5.2.6',
      '@fontsource-variable/source-sans-3': '^5.2.8',
      '@tailwindcss/vite': '^4.1.11',
      '@uswds-tailwind/compat': 'beta',
      '@uswds-tailwind/theme': 'beta',
      'tailwindcss': '^4.1.11',
    },
    devDependencies: {
      typescript: '^5.9.2',
      vite: '^7.0.6',
    },
  }
}

/**
 * Reads other configuration files from vanilla-ts example
 */
export function getStackBlitzConfigs() {
  try {
    const baseDir = path.resolve('../../examples/vanilla-ts')

    // Read TypeScript config
    const tsconfigPath = path.join(baseDir, 'tsconfig.json')
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))

    // Read Vite config
    const viteConfigPath = path.join(baseDir, 'vite.config.ts')
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

    // Read styles
    const stylesPath = path.join(baseDir, 'src/styles.css')
    const styles = fs.readFileSync(stylesPath, 'utf-8')

    // Read main entry point
    const indexPath = path.join(baseDir, 'src/index.ts')
    const indexTs = fs.readFileSync(indexPath, 'utf-8')

    return {
      tsconfig,
      viteConfig,
      styles,
      indexTs,
    }
  }
  catch (error) {
    console.warn('Failed to read vanilla-ts configs, using fallback:', error)
    return getFallbackConfigs()
  }
}

function getFallbackConfigs() {
  return {
    tsconfig: {
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        useDefineForClassFields: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        allowImportingTsExtensions: true,
        strict: true,
        noFallthroughCasesInSwitch: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noEmit: true,
        isolatedModules: true,
        skipLibCheck: true,
      },
      include: ['src'],
    },
    viteConfig: `import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})`,
    styles: `@import "@fontsource-variable/open-sans";
@import "@fontsource-variable/public-sans";
@import "@fontsource-variable/roboto-mono";
@import "@fontsource-variable/source-sans-3";
@import "@fontsource-variable/merriweather";

@import "tailwindcss";
@import "@uswds-tailwind/theme";`,
    indexTs: `import '@uswds-tailwind/compat/auto'`,
  }
}
