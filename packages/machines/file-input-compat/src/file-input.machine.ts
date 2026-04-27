import type { FileInputSchema, FileRejection } from './file-input.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './file-input.dom'
import { validateFiles } from './file-input.utils'

const DEFAULT_ERROR_MESSAGE = 'Error: This is not a valid file type.'

function isFileEqual(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

export const machine = createMachine<FileInputSchema>({
  props({ props }) {
    return {
      errorMessage: DEFAULT_ERROR_MESSAGE,
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable }) {
    return {
      acceptedFiles: bindable<File[]>(() => ({
        defaultValue: [],
      })),
      rejectedFiles: bindable<FileRejection[]>(() => ({
        defaultValue: [],
      })),
    }
  },

  computed: {
    itemsLabel: ({ prop }) => (prop('multiple') ? 'files' : 'file'),
  },

  on: {
    'INPUT.CHANGE': {
      actions: ['setFilesFromEvent'],
    },
    'FILES.CLEAR': {
      actions: ['clearFiles'],
    },
    'FILE.DELETE': {
      actions: ['removeFile'],
    },
    'OPEN': {
      actions: ['openFilePicker'],
    },
  },

  states: {
    idle: {
      on: {
        'INPUT.FOCUS': {
          target: 'focused',
        },
        'DROPZONE.DRAG_OVER': {
          target: 'dragging',
        },
      },
    },
    focused: {
      on: {
        'INPUT.BLUR': {
          target: 'idle',
        },
        'DROPZONE.DRAG_OVER': {
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        'DROPZONE.DRAG_LEAVE': {
          target: 'idle',
        },
        // Also processes files from dataTransfer since framework doesn't overlay
        'DROPZONE.DROP': {
          target: 'idle',
          actions: ['setFilesFromEvent'],
        },
      },
    },
  },

  implementations: {
    actions: {
      setFilesFromEvent({ context, event, prop }) {
        const files: File[] = event.files ?? []
        const acceptAttr = prop('accept')

        if (acceptAttr) {
          const allValid = validateFiles(files, acceptAttr)
          if (!allValid) {
            // All-or-nothing: if ANY file is invalid, reject ALL
            const errorMessage = prop('errorMessage')
            context.set('acceptedFiles', [])
            context.set(
              'rejectedFiles',
              files.map(file => ({ file, errors: [errorMessage] })),
            )
            prop('onFileChange')?.({
              acceptedFiles: [],
              rejectedFiles: files.map(file => ({ file, errors: [errorMessage] })),
            })
            return
          }
        }

        context.set('acceptedFiles', files)
        context.set('rejectedFiles', [])
        prop('onFileChange')?.({ acceptedFiles: files, rejectedFiles: [] })
      },

      // Clear all files and reset to initial state
      clearFiles({ context, prop }) {
        context.set('acceptedFiles', [])
        context.set('rejectedFiles', [])
        prop('onFileChange')?.({ acceptedFiles: [], rejectedFiles: [] })
      },

      // Remove a specific file from the accepted list
      removeFile({ context, event, prop }) {
        const fileToRemove: File = event.file
        const updatedFiles = context.get('acceptedFiles').filter(file => !isFileEqual(file, fileToRemove))
        context.set('acceptedFiles', updatedFiles)
        prop('onFileChange')?.({
          acceptedFiles: updatedFiles,
          rejectedFiles: context.get('rejectedFiles'),
        })
      },

      // Programmatically open the file dialog
      openFilePicker({ scope }) {
        raf(() => {
          dom.getInputEl(scope)?.click()
        })
      },
    },
  },
})
