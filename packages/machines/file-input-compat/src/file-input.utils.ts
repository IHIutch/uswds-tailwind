function isFileAccepted(file: File | null, accept: string | undefined) {
  if (file && accept) {
    const acceptedFiles = accept.split(',')
    const fileName = file.name || ''
    const fileType = (file.type || '').toLowerCase()

    return acceptedFiles.some((acceptedType) => {
      const fileTypePattern = acceptedType.trim()

      const fileNameMatch = fileName.indexOf(fileTypePattern) > 0

      const mimeTypePattern = fileTypePattern.replace(/\*/g, '')
      const mimeTypeMatch = fileType.includes(mimeTypePattern)

      return fileNameMatch || mimeTypeMatch
    })
  }
  return true
}

function isValidFileType(file: File, accept: string | undefined) {
  const isAcceptable = file.type === 'application/x-moz-file' || isFileAccepted(file, accept)
  return !!isAcceptable
}

export function validate(files: File[], accept?: string) {
  const rejected: { file: File, errors: string[] }[] = []
  files.forEach((file) => {
    const typeValid = isValidFileType(file, accept)
    if (!typeValid) {
      const errors = ['Invalid file type'].filter((e): e is string => e != null)
      rejected.push({ file, errors })
    }
  })
  if (rejected.length > 0) {
    return false
  }
  return true
}

export function getFileType(ext?: string) {
  switch (ext) {
    case 'pdf':
      return 'pdf' as const
    case 'doc':
    case 'docx':
    case 'pages':
      return 'doc' as const
    case 'xls':
    case 'xlsx':
    case 'numbers':
      return 'sheet' as const
    case 'mov':
    case 'mp4':
      return 'vid' as const
    default:
      return 'generic' as const
  }
}
