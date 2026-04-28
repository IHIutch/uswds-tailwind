function isIncluded(file: string, value: string) {
  const pos = file.indexOf(value)
  return pos >= 0
}

export function validateFiles(files: File[], acceptAttr: string) {
  const acceptedTypes = acceptAttr.split(',')

  let allFilesAllowed = true

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]!
    if (allFilesAllowed) {
      for (let j = 0; j < acceptedTypes.length; j += 1) {
        const fileType = acceptedTypes[j]!
        // Check 1: filename contains the type string (after position 0)
        // Check 2: MIME type contains the type (with asterisks removed)
        allFilesAllowed
          = file.name.indexOf(fileType) > 0
            || isIncluded(file.type, fileType.replace(/\*/g, ''))
        if (allFilesAllowed) {
          break
        }
      }
    }
    else {
      break
    }
  }

  return allFilesAllowed
}

export function getFilePreviewType(file: File): 'pdf' | 'word' | 'excel' | 'video' | 'generic' | 'image' {
  // Check if it's an image first (can be displayed as-is)
  if (file.type.startsWith('image/')) {
    return 'image'
  }

  const parts = file.name.split('.')
  const fileExtension = parts.length > 1 ? parts[parts.length - 1]!.toLowerCase() : ''

  if (fileExtension === 'pdf') {
    return 'pdf'
  }
  if (fileExtension === 'doc' || fileExtension === 'docx' || fileExtension === 'pages') {
    return 'word'
  }
  if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'numbers') {
    return 'excel'
  }
  if (fileExtension === 'mov' || fileExtension === 'mp4') {
    return 'video'
  }

  return 'generic'
}
