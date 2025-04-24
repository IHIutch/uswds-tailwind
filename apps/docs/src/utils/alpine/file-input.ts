import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('file-input', (el, directive) => {
    if (directive.value === 'dropzone')
      fileInputDropzone(el, Alpine)
    else if (directive.value === 'input')
      fileInputInput(el, Alpine)
    else if (directive.value === 'error-message')
      fileInputErrorMessage(el, Alpine)
    else fileInputRoot(el, Alpine)
  })
}

function fileInputRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
      return {
        isInitialized: false,
        isValid: true,
        errorMessage: '',
        inputEl: undefined as HTMLElement | undefined,
        isDragging: false,
        validateFiles() {
          const acceptedTypes = this.inputEl.getAttribute('accept')
          const minFileSize = this.inputEl.getAttribute('data-minsize')
          const maxFileSize = this.inputEl.getAttribute('data-maxsize')
          // const maxFiles = this.inputEl.getAttribute("data-maxfiles");

          const files: File[] = Array.from(this.$event.target.files || this.$event.dataTransfer.files)
          const acceptedFiles: File[] = []
          const rejectedFiles: { file: File, errors: string[] }[] = []

          files.forEach((file) => {
            const { isValid: isFileTypeValid, errorMessage: fileTypeError } = isValidFileType(file, acceptedTypes)
            const { isValid: isFileSizeValid, errorMessage: fileSizeError } = isValidFileSize(file, minFileSize, maxFileSize)
            if (isFileTypeValid && isFileSizeValid) {
              acceptedFiles.push(file)
            }
            else {
              const errors = [fileTypeError, fileSizeError]
              rejectedFiles.push({ file, errors: errors.filter(e => e !== null) as string[] })
            }
          })

          if (rejectedFiles.length > 0) {
            this.isValid = false
            this.errorMessage = rejectedFiles[0]?.errors[0]
          }
        },
      }
    },
    'x-init': function () {
      this.isInitialized = true
    },
    ':data-dragging': function () {
      return this.isDragging
    },
    ':data-invalid': function () {
      return !this.isValid
    },
  })
}

function fileInputDropzone(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-file-input:dropzone" is missing a parent element with "x-file-input".')
    },
    '@dragover': function () {
      return this.isDragging = true
    },
    '@dragleave': function () {
      return this.isDragging = false
    },
    '@drop': function () {
      return this.isDragging = false
    },
    '@change': function () {
      this.validateFiles()
    },
    ':data-dragging': function () {
      return this.isDragging
    },
  })
}

function fileInputInput(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-file-input:input" is missing a parent element with "x-file-input".')
      this.inputEl = el
    },
    ':data-invalid': function () {
      return !this.isValid
    },
    ':aria-invalid': function () {
      return !this.isValid
    },
  })
}

function fileInputErrorMessage(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-file-input:error-message" is missing a parent element with "x-file-input".')
      this.inputEl = el
    },
    'x-text': function () {
      return this.errorMessage
    },
  })
}

function isFileAccepted(file: File | null, accept: string | undefined) {
  if (file && accept) {
    const types = accept.split(',')

    const fileName = file.name || ''
    const mimeType = (file.type || '').toLowerCase()
    const baseMimeType = mimeType.replace(/\/.*$/, '')

    return types.some((type) => {
      const validType = type.trim().toLowerCase()

      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType)
      }

      if (validType.endsWith('/*')) {
        return baseMimeType === validType.replace(/\/.*$/, '')
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
    : { isValid: false, errorMessage: 'The selected file is an incorrect file type.' }
}

function isValidFileSize(file: File, minSize?: number, maxSize?: number) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize)
        return { isValid: false, errorMessage: `The selected file must be smaller than ${minSize}.` }
      if (file.size < minSize)
        return { isValid: false, errorMessage: `The selected file must be larger than ${maxSize}.` }
    }
    else if (isDefined(minSize) && file.size < minSize) {
      return { isValid: false, errorMessage: `The selected file must be larger than ${maxSize}.` }
    }
    else if (isDefined(maxSize) && file.size > maxSize) {
      return { isValid: false, errorMessage: `The selected file must be smaller than ${minSize}.` }
    }
  }
  return { isValid: true, errorMessage: null }
}
