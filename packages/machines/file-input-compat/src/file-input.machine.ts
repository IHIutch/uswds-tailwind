import type { FileData, FileInputSchema } from './file-input.types'
import { createMachine } from '@zag-js/core'
import { getFileType, validate } from './file-input.utils'

function debounce<T extends (...args: any[]) => void>(callback: T, wait: number) {
  let timeoutId: number | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}

const debounced = debounce((fn) => {
  fn()
}, 1000)

export const machine = createMachine<FileInputSchema>({
  props({ props }) {
    return {
      srStatusText: 'No file selected.',
      disabled: false,
      minFileSize: 0,
      maxFileSize: Number.POSITIVE_INFINITY,
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    return {
      isValid: bindable(() => ({ defaultValue: true })),
      errorMessage: bindable(() => ({ defaultValue: '' })),
      isDragging: bindable(() => ({ defaultValue: false })),
      isDisabled: bindable(() => ({ defaultValue: prop('disabled') })),
      srStatusText: bindable(() => ({ defaultValue: prop('srStatusText') })),
      files: bindable<FileData[]>(() => ({ defaultValue: [] })),
    }
  },

  watch({ track, context, send }) {
    track([() => context.get('files').length], () => {
      const files = context.get('files')
      if (files.length === 0) {
        send({ type: 'RESET_TO_IDLE' })
      }
    })
  },

  states: {
    idle: {
      on: {
        INVALID: { target: 'invalid' },
        VALID: { target: 'valid' },
      },
    },
    valid: {
      on: {
        INVALID: { target: 'invalid' },
        RESET_TO_IDLE: { target: 'idle' },
      },
    },
    invalid: {
      on: {
        VALID: { target: 'valid' },
        RESET_TO_IDLE: { target: 'idle' },
      },
    },
  },

  on: {
    CHANGE: { actions: ['validateFiles', 'updateSrStatus'] },
    DRAG_START: { actions: ['setDragging'] },
    DRAG_END: { actions: ['setDragging'] },
    CHECK_EMPTY_FILES: { actions: ['checkEmptyFiles'] },
  },

  implementations: {
    actions: {
      setDragging({ context, event }) {
        context.set('isDragging', event.type === 'DRAG_START')
      },
      validateFiles({ context, event, prop, send }) {
        const files = (event.files || []) as File[]
        const { isValid, errorMessage } = validate(files, prop('accept'), prop('minSize'), prop('maxSize'))
        context.set('isValid', isValid)
        context.set('errorMessage', errorMessage)
        if (isValid) {
          const fileData = files.map(file => ({
            name: file.name,
            type: getFileType(file.name.split('.').pop()),
          }))
          context.set('files', fileData)
          send({ type: 'VALID' })
        }
        else {
          context.set('files', [])
          send({ type: 'INVALID' })
        }
      },
      updateSrStatus({ context, prop }) {
        const files = context.get('files')
        let text = prop('srStatusText')

        if (files && files.length === 1 && files[0]) {
          text = `You have selected the file: ${files[0].name}`
        }
        else if (files && files.length > 1) {
          const fileNames = files.map(file => file.name).filter(Boolean)
          text = `You have selected ${files.length} files: ${fileNames.join(', ')}`
        }

        debounced(() => {
          context.set('srStatusText', text)
        })
      },
      checkEmptyFiles({ context, send }) {
        const files = context.get('files')
        if (!files || files.length === 0) {
          send({ type: 'RESET_TO_IDLE' })
        }
      },
    },
  },
})
