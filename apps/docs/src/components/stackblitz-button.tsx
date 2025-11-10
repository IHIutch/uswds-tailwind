import sdk from '@stackblitz/sdk'

export default function StackBlitzButton({
  componentName,
  htmlContent,
  description,
}: {
  componentName: string
  htmlContent: string
  description?: string
}) {
  const handleClick = () => {
    try {
      openInStackBlitz({
        htmlContent,
        title: `${componentName} - USWDS + Tailwind`,
        description: description || `Interactive example of ${componentName} component using USWDS + Tailwind`,
      })
      // @ts-expect-error Fathom is loaded globally
      window.fathom.trackEvent(`Stackblitz: ${componentName}`)
    }
    catch (error) {
      console.error('Failed to open StackBlitz:', error)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex rounded-sm items-center justify-center h-8 bg-[#1574ef] hover:bg-[#135fcc] px-3 gap-1 text-sm text-white focus:outline-4 focus:outline-offset-2 cursor-pointer focus:outline-blue-40v transition-colors"
    >
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"></path></svg>
      StackBlitz
    </button>
  )
}

export async function openInStackBlitz({
  htmlContent,
  title,
  description,
}: {
  htmlContent: string
  title: string
  description: string
}) {
  const packageJson = {
    name: 'uswds-tailwind-example',
    type: 'module',
    version: '0.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      '@fontsource-variable/merriweather': '^5.2.4',
      '@fontsource-variable/open-sans': '^5.2.6',
      '@fontsource-variable/public-sans': '^5.2.6',
      '@fontsource-variable/roboto-mono': '^5.2.6',
      '@fontsource-variable/source-sans-3': '^5.2.8',
      '@tailwindcss/vite': '^4.1.11',
      '@uswds-tailwind/compat': 'latest',
      '@uswds-tailwind/theme': 'latest',
      'tailwindcss': '^4.1.11',
    },
    devDependencies: {
      typescript: '^5.9.2',
      vite: '^7.0.6',
    },
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: [
        'ES2020',
        'DOM',
        'DOM.Iterable',
      ],
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
    include: [
      'src',
    ],
  }

  const styles = `@import "@fontsource-variable/open-sans";
  @import "@fontsource-variable/public-sans";
  @import "@fontsource-variable/roboto-mono";
  @import "@fontsource-variable/source-sans-3";
  @import "@fontsource-variable/merriweather";

  @import "tailwindcss";
  @import "@uswds-tailwind/theme";
  `

  const viteConfig = `import tailwindcss from '@tailwindcss/vite'
  import { defineConfig } from 'vite'

  export default defineConfig({
    plugins: [
      tailwindcss(),
    ],
  })
  `
  const indexTs = `import '@uswds-tailwind/compat/auto'`

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link href="./src/styles.css" rel="stylesheet">
</head>
<body class="font-source-sans p-4">
${htmlContent.trim()}

  <script type="module" src="./src/index.ts"></script>
</body>
</html>`

  const files = {
    'package.json': JSON.stringify(packageJson, null, 2),
    'tsconfig.json': JSON.stringify(tsconfig, null, 2),
    'vite.config.ts': viteConfig,
    'src/styles.css': styles,
    'src/index.ts': indexTs,
    'index.html': indexHtml,
  }

  // Open in StackBlitz
  sdk.openProject(
    {
      title,
      description,
      template: 'node',
      files,
    },
    {
      openFile: 'index.html',
      newWindow: true,
    },
  )
}
