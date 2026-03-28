import type { FileInputSchema } from './file-input.types'
import { createMachine } from '@zag-js/core'
import { validate } from './file-input.utils'

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
      errorMessage: 'Error: This is not a valid file type.',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    return {
      isDragging: bindable(() => ({ defaultValue: false })),
      isInvalid: bindable(() => ({ defaultValue: false })),
      isDisabled: bindable(() => ({ defaultValue: prop('disabled') })),
      srStatusText: bindable(() => ({ defaultValue: prop('srStatusText') })),
      files: bindable<File[]>(() => ({ defaultValue: [] })),
    }
  },

  watch({ track, context, send }) {
    track([() => context.get('files').length], () => {
      const files = context.get('files')
      if (files.length === 0) {
        send({ type: 'RESET' })
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
        RESET: { target: 'idle' },
        INVALID: { target: 'invalid' },
      },
    },
    invalid: {
      on: {
        RESET: { target: 'idle' },
        VALID: { target: 'valid' },
      },
    },
  },

  on: {
    CHANGE: {
      actions: ['validateFiles', 'updateSrStatus'],
    },
  },

  implementations: {
    actions: {
      validateFiles({ context, event, prop, send }) {
        const files = (event.files || []) as File[]
        const isValid = validate(files, prop('accept'))
        if (isValid) {
          context.set('files', files)
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
          send({ type: 'RESET' })
        }
      },
    },
  },
})
