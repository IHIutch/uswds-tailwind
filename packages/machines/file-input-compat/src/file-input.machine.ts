import type { FileInputSchema } from './file-input.types'
import { createMachine } from '@zag-js/core'

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

function validate(files: File[], accept?: string, minSize?: number, maxSize?: number) {
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
    return { isValid: false, errorMessage: rejected[0].errors[0] }
  }
  return { isValid: true, errorMessage: '' }
}

export const machine = createMachine<FileInputSchema>({
  props({ props }) {
    return {
      accept: props.accept,
      minSize: props.minSize,
      maxSize: props.maxSize,
      ...props,
    }
  },

  initialState() {
    return 'valid'
  },

  context({ bindable }) {
    return {
      isValid: bindable(() => ({ defaultValue: true })),
      errorMessage: bindable(() => ({ defaultValue: '' })),
      isDragging: bindable(() => ({ defaultValue: false })),
    }
  },

  watch({ track, context, action }) {
    track([() => context.get('isValid')], () => {
      action('toggleState')
    })
  },

  states: {
    valid: {
      on: {
        CHANGE: { actions: 'handleChange' },
        DRAG_START: { actions: 'startDragging' },
        DRAG_END: { actions: 'endDragging' },
        INVALID: { target: 'invalid' },
      },
    },
    invalid: {
      on: {
        CHANGE: { actions: 'handleChange' },
        DRAG_START: { actions: 'startDragging' },
        DRAG_END: { actions: 'endDragging' },
        VALID: { target: 'valid' },
      },
    },
  },

  implementations: {
    actions: {
      startDragging({ context }) {
        context.set('isDragging', true)
      },
      endDragging({ context }) {
        context.set('isDragging', false)
      },
      handleChange({ context, prop, event, send }) {
        const files = 'files' in event ? event.files : []
        const { isValid, errorMessage } = validate(files, prop('accept'), prop('minSize'), prop('maxSize'))
        context.set('isValid', isValid)
        context.set('errorMessage', errorMessage)
        send({ type: isValid ? 'VALID' : 'INVALID' })
      },
      toggleState({ context, send }) {
        const isValid = context.get('isValid')
        send({ type: isValid ? 'VALID' : 'INVALID' })
      },
    },
  },
})
