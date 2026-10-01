import type { Project } from '@stackblitz/sdk'
import stackblitzRelease from '../../../../examples/vanilla-ts/stackblitz-release.json'

// Keep both generated templates on the published release until the launch
// channel changes.
const playgroundPackageVersion = stackblitzRelease.version

const vanillaViteConfig = `import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [tailwindcss()] })
`

const reactViteConfig = `import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
`

const vanillaStyles = `@import "tailwindcss";
@import "@uswds-tailwind/theme";
`

export function createVanillaStackBlitzProject({ htmlContent, title, description }: {
  htmlContent: string
  title: string
  description: string
}): Project {
  const packageJson = {
    name: 'uswds-tailwind-vanilla-example',
    private: true,
    type: 'module',
    scripts: { dev: 'vite --host', build: 'tsc && vite build', preview: 'vite preview' },
    dependencies: {
      '@fontsource-variable/merriweather': '^5.2.6',
      '@fontsource-variable/open-sans': '^5.2.7',
      '@fontsource-variable/public-sans': '^5.2.7',
      '@fontsource-variable/roboto-mono': '^5.2.8',
      '@fontsource-variable/source-sans-3': '^5.2.9',
      '@tailwindcss/vite': '4.3.3',
      '@uswds-tailwind/compat': playgroundPackageVersion,
      '@uswds-tailwind/theme': playgroundPackageVersion,
      'tailwindcss': '4.3.3',
    },
    devDependencies: { typescript: '^5.9.3', vite: '7.2.7' },
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      noEmit: true,
      skipLibCheck: true,
    },
    include: ['src'],
  }

  return {
    title,
    description,
    template: 'node',
    files: {
      'package.json': JSON.stringify(packageJson, null, 2),
      'tsconfig.json': JSON.stringify(tsconfig, null, 2),
      'vite.config.ts': vanillaViteConfig,
      'src/styles.css': vanillaStyles,
      'src/index.ts': `import '@uswds-tailwind/compat/auto'\n`,
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body class="font-source-sans p-4">
${htmlContent.trim()}
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>`,
    },
  }
}

export function createReactStackBlitzProject({ componentName, entryFile, files, dependencies = {} }: {
  componentName: string
  entryFile: string
  files: Record<string, string>
  dependencies?: Record<string, string>
}): Project {
  const packageJson = {
    name: 'uswds-tailwind-react-example',
    private: true,
    type: 'module',
    scripts: { dev: 'vite --host', build: 'tsc && vite build', preview: 'vite preview' },
    dependencies: {
      '@uswds-tailwind/react': playgroundPackageVersion,
      '@tailwindcss/vite': '4.3.3',
      'tailwindcss': '4.3.3',
      'react': '^19.2.3',
      'react-dom': '^19.2.3',
      ...dependencies,
    },
    devDependencies: {
      '@types/react': '^19.2.7',
      '@types/react-dom': '^19.2.3',
      '@vitejs/plugin-react': '4.7.0',
      'typescript': '^5.9.3',
      'vite': '7.2.7',
    },
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      allowImportingTsExtensions: true,
      strict: true,
      noEmit: true,
      skipLibCheck: true,
    },
    include: ['src'],
  }

  return {
    title: `${componentName} - USWDS + Tailwind React`,
    description: `Interactive React example of ${componentName}`,
    template: 'node',
    files: {
      'package.json': JSON.stringify(packageJson, null, 2),
      'tsconfig.json': JSON.stringify(tsconfig, null, 2),
      'index.html': '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
      'vite.config.ts': reactViteConfig,
      'src/styles.css': '@import "tailwindcss";\n@import "@uswds-tailwind/react";\n',
      'src/main.tsx': `import { createRoot } from 'react-dom/client'
import Demo from './${entryFile}'
import './styles.css'

createRoot(document.getElementById('root')!).render(<Demo />)
`,
      ...Object.fromEntries(Object.entries(files).map(([name, source]) => [`src/${name}`, source])),
    },
  }
}
