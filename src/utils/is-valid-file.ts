function isFileAccepted(file: File | null, accept: string | undefined) {
  if (file && accept) {
    const types = accept.split(",")

    const fileName = file.name || ""
    const mimeType = (file.type || "").toLowerCase()
    const baseMimeType = mimeType.replace(/\/.*$/, "")

    return types.some((type) => {
      const validType = type.trim().toLowerCase()

      if (validType.charAt(0) === ".") {
        return fileName.toLowerCase().endsWith(validType)
      }

      if (validType.endsWith("/*")) {
        return baseMimeType === validType.replace(/\/.*$/, "")
      }

      return mimeType === validType
    })
  }
  return true
}

function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined && v !== null
}

export function isValidFileType(file: File, accept: string | undefined) {
  const isAcceptable = file.type === "application/x-moz-file" || isFileAccepted(file, accept)
  return isAcceptable
    ? { isValid: true, errorMessage: null }
    : { isValid: false, errorMessage: 'The selected file is an incorrect file type.' }
}

export function isValidFileSize(file: File, minSize?: number, maxSize?: number) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return { isValid: false, errorMessage: `The selected file must be smaller than ${minSize}.` }
      if (file.size < minSize) return { isValid: false, errorMessage: `The selected file must be larger than ${maxSize}.` }
    } else if (isDefined(minSize) && file.size < minSize) {
      return { isValid: false, errorMessage: `The selected file must be larger than ${maxSize}.` }
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return { isValid: false, errorMessage: `The selected file must be smaller than ${minSize}.` }
    }
  }
  return { isValid: true, errorMessage: null }
}
