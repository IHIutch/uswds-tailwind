import sdk from '@stackblitz/sdk'
import StackBlitzExportButton from './stackblitz-export-button'
import { createVanillaStackBlitzProject } from './stackblitz-project'

export default function StackBlitzButton({ componentName, htmlContent, description }: {
  componentName: string
  htmlContent: string
  description?: string
}) {
  const open = () => openInStackBlitz({
    htmlContent,
    title: `${componentName} - USWDS + Tailwind Vanilla`,
    description: description || `Interactive Vanilla example of ${componentName} using USWDS + Tailwind`,
  })

  return <StackBlitzExportButton componentName={componentName} library="vanilla" onOpen={open} />
}

export function openInStackBlitz({ htmlContent, title, description }: {
  htmlContent: string
  title: string
  description: string
}) {
  sdk.openProject(
    createVanillaStackBlitzProject({ htmlContent, title, description }),
    { openFile: 'index.html', newWindow: true },
  )
}
