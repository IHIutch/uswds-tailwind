function isFileAccepted(file: File | null, accept: string | undefined) {
  if (file && accept) {
    const types = accept.split(',')

    const fileName = file.name || ''
    const mimeType = (file.type || '').toLowerCase()
    const baseMimeType = mimeType.replace(/\/.*/, '')

    return types.some((type) => {
      const validType = type.trim().toLowerCase()

      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType)
      }

      if (validType.endsWith('/*')) {
        return baseMimeType === validType.replace(/\/.*/, '')
      }

      return mimeType === validType
    })
  }
  return true
}

function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined && v !== null
}

function isValidFileType(file: File, accept: string | undefined) {
  const isAcceptable = file.type === 'application/x-moz-file' || isFileAccepted(file, accept)
  return isAcceptable
    ? { isValid: true, errorMessage: null }
    : { isValid: false, errorMessage: 'Error: This is not a valid file type.' }
}

function isValidFileSize(file: File, minSize?: number, maxSize?: number) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize)
        return { isValid: false, errorMessage: `The selected file must be smaller than ${maxSize}.` }
      if (file.size < minSize)
        return { isValid: false, errorMessage: `The selected file must be larger than ${minSize}.` }
    }
    else if (isDefined(minSize) && file.size < minSize) {
      return { isValid: false, errorMessage: `The selected file must be larger than ${minSize}.` }
    }
    else if (isDefined(maxSize) && file.size > maxSize) {
      return { isValid: false, errorMessage: `The selected file must be smaller than ${maxSize}.` }
    }
  }
  return { isValid: true, errorMessage: null }
}

export function validate(files: File[], accept?: string, minSize?: number, maxSize?: number) {
  const rejected: { file: File, errors: string[] }[] = []
  files.forEach((file) => {
    const { isValid: typeValid, errorMessage: typeError } = isValidFileType(file, accept)
    const { isValid: sizeValid, errorMessage: sizeError } = isValidFileSize(file, minSize, maxSize)
    if (!typeValid || !sizeValid) {
      const errors = [typeError, sizeError].filter((e): e is string => e != null)
      rejected.push({ file, errors })
    }
  })
  if (rejected.length > 0) {
    return { isValid: false, errorMessage: rejected[0]?.errors[0] || 'File validation failed' }
  }
  return { isValid: true, errorMessage: '' }
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
