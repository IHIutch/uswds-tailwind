import type { FileInputSchema } from './file-input.types'
import { createMachine } from '@zag-js/core'
import { isDom } from '@zag-js/dom-query'
import { getFinePointerQuery, getStatusMessage, isBatchValid } from './file-input.utils'

export const machine = createMachine<FileInputSchema>({
  props({ props }) {
    return {
      errorText: 'Error: This is not a valid file type.',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  refs({ prop }) {
    return {
      statusTimers: new Set<ReturnType<Window['setTimeout']>>(),
      // USWDS creates its status region only when initially enabled.
      hasStatus: !(prop('disabled') || prop('ariaDisabled')),
    }
  },

  effects: ['cleanupTimers', 'trackFinePointer'],

  context({ prop, bindable, scope }) {
    return {
      acceptedFiles: bindable<File[]>(() => ({
        defaultValue: [],
      })),
      invalid: bindable<boolean>(() => ({ defaultValue: false })),
      errorText: bindable<string>(() => ({ defaultValue: '' })),
      srStatusText: bindable<string>(() => ({ defaultValue: getStatusMessage([], prop('multiple')) })),
      finePointer: bindable<boolean>(() => ({
        defaultValue: isDom() && !!getFinePointerQuery(scope.getWin())?.matches,
      })),
    }
  },

  states: {
    idle: {
      on: {
        'DROPZONE.DRAG_OVER': { target: 'dragging' },
      },
    },
    dragging: {
      on: {
        'DROPZONE.DRAG_LEAVE': { target: 'idle' },
        'DROPZONE.DROP': { target: 'idle' },
      },
    },
  },

  on: {
    'FILE.SELECT': { actions: ['setEventFiles'] },
  },

  implementations: {
    actions: {
      setEventFiles({ context, event, prop, scope, refs }) {
        if (event.type !== 'FILE.SELECT')
          return
        const files = event.files
        const invalid = !isBatchValid(prop('accept'), files)
        context.set('acceptedFiles', invalid ? [] : files)
        context.set('invalid', invalid)
        context.set('errorText', invalid ? prop('errorText') : '')

        if (invalid || !refs.get('hasStatus'))
          return
        const message = getStatusMessage(files, prop('multiple'))
        // USWDS queues each announcement rather than debouncing selections.
        const win = scope.getWin()
        const timer = win.setTimeout(() => {
          refs.get('statusTimers').delete(timer)
          context.set('srStatusText', message)
        }, 1000)
        refs.get('statusTimers').add(timer)
      },
    },
    effects: {
      // USWDS rebuilds its instructions whenever the pointer media query changes.
      trackFinePointer({ context, scope }) {
        const mediaQuery = getFinePointerQuery(scope.getWin())
        if (!mediaQuery)
          return
        const onChange = () => context.set('finePointer', mediaQuery.matches)
        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
      },
      cleanupTimers({ scope, refs }) {
        return () => {
          const win = scope.getWin()
          for (const timer of refs.get('statusTimers'))
            win.clearTimeout(timer)
          refs.get('statusTimers').clear()
        }
      },
    },
  },
})
