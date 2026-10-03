import type { PreviewType } from './file-input.types'

export const getItemsLabel = (multiple: boolean) => (multiple ? 'files' : 'file')

export function getStatusMessage(files: readonly File[], multiple: boolean): string {
  if (files.length === 1)
    return `You have selected the file: ${files[0]?.name ?? ''}`
  if (files.length > 1)
    return `You have selected ${files.length} files: ${files.map(file => file.name).join(', ')}`
  return `No ${getItemsLabel(multiple)} selected.`
}

export const getDefaultAriaLabel = (itemsLabel: string) => `Drag ${itemsLabel} here or choose from folder`

// USWDS matches raw, case-sensitive tokens: no trimming, filename index > 0,
// MIME substring index >= 0, and every asterisk removed from MIME tokens.
export function isBatchValid(accept: string | undefined, files: File[]): boolean {
  if (!accept)
    return true
  const tokens = accept.split(',')
  return files.every(file => !file || tokens.some(token =>
    file.name.indexOf(token) > 0 || file.type.includes(token.replace(/\*/g, '')),
  ))
}

// Preserve USWDS extension case sensitivity: report.PDF falls back to generic.
export function getPreviewType(file: File): PreviewType {
  const ext = file.name.split('.').pop() ?? ''
  if (ext === 'pdf')
    return 'pdf'
  if (ext === 'doc' || ext === 'docx' || ext === 'pages')
    return 'word'
  if (ext === 'xls' || ext === 'xlsx' || ext === 'numbers')
    return 'excel'
  if (ext === 'mov' || ext === 'mp4')
    return 'video'
  return 'generic'
}
