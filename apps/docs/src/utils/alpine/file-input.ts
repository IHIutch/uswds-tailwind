import type { Alpine, ElementWithXAttributes } from "alpinejs"
import { isValidFileSize, isValidFileType } from "../../utils/is-valid-file"

export default function (Alpine: Alpine) {
  Alpine.directive('file-input', (el, directive) => {
    if (directive.value === 'dropzone') fileInputDropzone(el, Alpine)
    else if (directive.value === 'input') fileInputInput(el, Alpine)
    else if (directive.value === 'error-message') fileInputErrorMessage(el, Alpine)
    else fileInputRoot(el, Alpine)
  })
}

const fileInputRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        isInitialized: false,
        isValid: true,
        errorMessage: '',
        inputEl: undefined as HTMLElement | undefined,
        isDragging: false,
        validateFiles() {
          const acceptedTypes = this.inputEl.getAttribute("accept");
          const minFileSize = this.inputEl.getAttribute("data-minsize");
          const maxFileSize = this.inputEl.getAttribute("data-maxsize");
          const maxFiles = this.inputEl.getAttribute("data-maxfiles");

          const files: File[] = Array.from(this.$event.target.files || this.$event.dataTransfer.files)
          const acceptedFiles: File[] = []
          const rejectedFiles: { file: File, errors: string[] }[] = []

          files.forEach(file => {
            const { isValid: isFileTypeValid, errorMessage: fileTypeError } = isValidFileType(file, acceptedTypes)
            const { isValid: isFileSizeValid, errorMessage: fileSizeError } = isValidFileSize(file, minFileSize, maxFileSize)
            if (isFileTypeValid && isFileSizeValid) {
              acceptedFiles.push(file)
            } else {
              const errors = [fileTypeError, fileSizeError]
              rejectedFiles.push({ file, errors: errors.filter((e) => e !== null) as string[] })
            }
          });

          if (rejectedFiles.length > 0) {
            this.isValid = false
            this.errorMessage = rejectedFiles[0]?.errors[0]
          }
        }
      }
    },
    'x-init'() {
      this.isInitialized = true
    },
    ':data-dragging'() {
      return this.isDragging
    },
    ':data-invalid'() {
      return !this.isValid
    }
  })
}

const fileInputDropzone = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-file-input:dropzone" is missing a parent element with "x-file-input".')
    },
    '@dragover'() {
      return this.isDragging = true
    },
    '@dragleave'() {
      return this.isDragging = false
    },
    '@drop'() {
      return this.isDragging = false
    },
    '@change'() {
      this.validateFiles()
    },
    ':data-dragging'() {
      return this.isDragging
    },
  })
}

const fileInputInput = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-file-input:input" is missing a parent element with "x-file-input".')
      this.inputEl = el;
    },
    ':data-invalid'() {
      return !this.isValid
    },
    ':aria-invalid'() {
      return !this.isValid
    }
  })
}

const fileInputErrorMessage = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-file-input:error-message" is missing a parent element with "x-file-input".')
      this.inputEl = el;
    },
    'x-text'() {
      return this.errorMessage
    },
  })
}
