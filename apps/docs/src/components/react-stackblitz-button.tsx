import sdk from '@stackblitz/sdk'

export default function ReactStackBlitzButton({ componentName, entryFile, files }: {
  componentName: string
  entryFile: string
  files: Record<string, string>
}) {
  const open = () => {
    const projectFiles: Record<string, string> = {
      'package.json': JSON.stringify({
        name: 'uswds-tailwind-react-example',
        private: true,
        type: 'module',
        scripts: { dev: 'vite --host', build: 'vite build' },
        dependencies: {
          '@uswds-tailwind/react': 'latest',
          '@tailwindcss/vite': '^4.1.14',
          'tailwindcss': '^4.1.18',
          'react': '^19.2.3',
          'react-dom': '^19.2.3',
          'vite': '^7.2.7',
        },
        devDependencies: { typescript: '^5.9.3' },
      }, null, 2),
      'index.html': '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
      'vite.config.ts': 'import tailwindcss from \'@tailwindcss/vite\'\nimport { defineConfig } from \'vite\'\nexport default defineConfig({ plugins: [tailwindcss()] })\n',
      'src/styles.css': '@import "tailwindcss";\n@import "@uswds-tailwind/react";\n',
      'src/main.tsx': `import { createRoot } from 'react-dom/client'
import Demo from './${entryFile}'
import './styles.css'

createRoot(document.getElementById('root')!).render(<Demo />)
`,
      ...Object.fromEntries(Object.entries(files).map(([name, source]) => [`src/${name}`, source])),
    }
    sdk.openProject({
      title: `${componentName} - USWDS + Tailwind React`,
      description: `Interactive React example of ${componentName}`,
      template: 'node',
      files: projectFiles,
    }, { openFile: `src/${entryFile}`, newWindow: true })
  }

  return (
    <button type="button" onClick={open} className="flex rounded-sm items-center justify-center h-8 bg-[#1574ef] hover:bg-[#135fcc] px-3 gap-1 text-sm text-white focus:outline-4 focus:outline-offset-2 cursor-pointer">
      StackBlitz
    </button>
  )
}
