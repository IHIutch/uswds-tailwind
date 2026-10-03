import type { FileInputSchema } from './file-input.types'
import { createMachine } from '@zag-js/core'
import * as dom from './file-input.dom'
import * as utils from './file-input.utils'

export const machine = createMachine<FileInputSchema>({
  props({ props }) {
    return {
      disabled: false,
      ariaDisabled: false,
      multiple: false,
      errorText: 'Error: This is not a valid file type.',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  refs() {
    return {
      statusTimers: [] as ReturnType<Window['setTimeout']>[],
    }
  },

  effects: ['cleanupTimers', 'observeNativeInput'],

  context({ prop, bindable }) {
    // USWDS creates its status region only when initially enabled.
    const hasStatus = !(prop('disabled') || prop('ariaDisabled'))
    return {
      acceptedFiles: bindable<File[]>(() => ({
        defaultValue: [],
        sync: true,
        hash: files => files.map(dom.getFileIdentity).join('|'),
      })),
      invalid: bindable<boolean>(() => ({ defaultValue: false })),
      errorText: bindable<string>(() => ({ defaultValue: '' })),
      srStatusText: bindable<string>(() => ({ defaultValue: utils.getStatusMessage([], prop('multiple')) })),
      hasStatus: bindable<boolean>(() => ({ defaultValue: hasStatus })),
    }
  },

  states: {
    idle: {
      on: {
        'DRAG.OVER': { target: 'dragging' },
      },
    },
    dragging: {
      on: {
        'DRAG.LEAVE': { target: 'idle' },
        'DROP': { target: 'idle' },
      },
    },
  },

  on: {
    'FILES.CHANGE': [
      { guard: 'isValidBatch', actions: ['acceptFiles', 'scheduleStatus'] },
      { actions: ['rejectBatch'] },
    ],
  },

  implementations: {
    guards: {
      // Keep validation local so one input's rejection cannot suppress a sibling change.
      isValidBatch: ({ prop, event }) => event.type === 'FILES.CHANGE' && utils.isBatchValid(prop('accept'), event.files),
    },
    actions: {
      acceptFiles({ context, event }) {
        if (event.type !== 'FILES.CHANGE')
          return
        const files = event.files
        context.set('acceptedFiles', files)
        context.set('invalid', false)
        context.set('errorText', '')
      },
      rejectBatch({ context, event, prop }) {
        if (event.type !== 'FILES.CHANGE')
          return
        const errorText = prop('errorText')
        context.set('acceptedFiles', [])
        context.set('invalid', true)
        context.set('errorText', errorText)
      },
      scheduleStatus({ context, event, scope, refs, prop }) {
        if (!context.get('hasStatus'))
          return
        if (event.type !== 'FILES.CHANGE')
          return
        const files = event.files
        const message = utils.getStatusMessage(files, prop('multiple'))
        // USWDS queues each announcement rather than debouncing selections.
        const win = scope.getWin()
        const timer = win.setTimeout(() => {
          const timers = refs.get('statusTimers')
          const index = timers.indexOf(timer)
          if (index >= 0)
            timers.splice(index, 1)
          context.set('srStatusText', message)
        }, 1000)
        refs.get('statusTimers').push(timer)
      },
    },
    effects: {
      cleanupTimers({ scope, refs }) {
        return () => {
          const win = scope.getWin()
          for (const timer of refs.get('statusTimers'))
            win.clearTimeout(timer)
          refs.get('statusTimers').length = 0
        }
      },
      // A target listener can suppress rejected changes before parent listeners run.
      observeNativeInput({ scope, send, prop }) {
        let removeChangeListener = () => {}
        const stopObserving = dom.observeInputMount(scope, (input) => {
          removeChangeListener()
          if (!input)
            return
          const onChange = (event: Event) => {
            // MutationObserver cleanup may lag behind a replaced input.
            if (dom.getInputEl(scope) !== input)
              return
            // Snapshot the selection before rejection clears the native input.
            const files = Array.from(input.files ?? [])
            if (!utils.isBatchValid(prop('accept'), files)) {
              input.value = ''
              event.preventDefault()
              event.stopPropagation()
            }
            send({ type: 'FILES.CHANGE', files })
          }
          input.addEventListener('change', onChange)
          removeChangeListener = () => input.removeEventListener('change', onChange)
        })
        return () => {
          removeChangeListener()
          stopObserving()
        }
      },
    },
  },
})
