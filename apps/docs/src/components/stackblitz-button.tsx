import sdk from '@stackblitz/sdk'
import { getStackBlitzConfigs, getStackBlitzDependencies } from '../utils/sync-stackblitz-deps'

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

interface StackBlitzProjectFiles {
  [path: string]: string
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
  // Get up-to-date dependencies from vanilla-ts example
  const { dependencies, devDependencies } = getStackBlitzDependencies()

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
    dependencies,
    devDependencies,
  }

  // Get up-to-date configs from vanilla-ts example
  const { tsconfig, viteConfig, styles, indexTs } = getStackBlitzConfigs()

  // Process the HTML content to create a complete HTML document
  const processedHTML = createCompleteHTML(htmlContent, title)

  const files: StackBlitzProjectFiles = {
    'package.json': JSON.stringify(packageJson, null, 2),
    'tsconfig.json': JSON.stringify(tsconfig, null, 2),
    'vite.config.ts': viteConfig,
    'src/styles.css': styles,
    'src/index.ts': indexTs,
    'index.html': processedHTML,
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

/**
 * Creates a complete HTML document from component HTML content
 */
function createCompleteHTML(componentHTML: string, title: string): string {
  // Extract the body content from component HTML if it's a complete HTML document
  const bodyMatch = componentHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const bodyContent = bodyMatch ? bodyMatch[1] : componentHTML

  // Extract any custom classes from the original body tag
  const bodyClassMatch = componentHTML.match(/<body[^>]*class="([^"]*)"/)
  const bodyClasses = bodyClassMatch ? bodyClassMatch[1] : 'font-source-sans p-4'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link href="./src/styles.css" rel="stylesheet">
</head>
<body class="${bodyClasses}">
${bodyContent.trim()}

  <script type="module" src="./src/index.ts"></script>
</body>
</html>`
}
