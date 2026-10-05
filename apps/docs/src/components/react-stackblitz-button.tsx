import sdk from '@stackblitz/sdk'
import StackBlitzExportButton from './stackblitz-export-button'
import { createReactStackBlitzProject } from './stackblitz-project'

export default function ReactStackBlitzButton({ componentName, entryFile, files, dependencies }: {
  componentName: string
  entryFile: string
  files: Record<string, string>
  dependencies?: Record<string, string>
}) {
  const open = () => sdk.openProject(
    createReactStackBlitzProject({ componentName, entryFile, files, dependencies }),
    { openFile: `src/${entryFile}`, newWindow: true },
  )

  return <StackBlitzExportButton componentName={componentName} library="react" onOpen={open} />
}
