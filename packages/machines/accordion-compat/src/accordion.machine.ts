import type { AccordionSchema } from './accordion.types'
import { createMachine } from '@zag-js/core'
import { getWindow, raf } from '@zag-js/dom-query'
import * as dom from './accordion.dom'

// Pure DOM read — checks if all four edges of the element are within the viewport.
function isElementInViewport(el: HTMLElement) {
  const win = getWindow(el)
  const docEl = el.ownerDocument.documentElement
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (win.innerHeight || docEl.clientHeight)
    && rect.right <= (win.innerWidth || docEl.clientWidth)
  )
}

export const machine = createMachine<AccordionSchema>({
  props({ props }) {
    return {
      multiple: false,
      defaultValue: [],
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ prop, bindable }) {
    return {
      value: bindable<string[]>(() => ({
        defaultValue: prop('defaultValue'),
        value: prop('value'),
        onChange(value) {
          prop('onValueChange')?.({ value })
        },
      })),
    }
  },

  // Global events — always handled regardless of state
  on: {
    'VALUE.SET': {
      actions: ['setValue'],
    },
  },

  states: {
    idle: {
      on: {
        'TRIGGER.CLICK': [
          {
            guard: 'isExpanded',
            actions: ['collapse'],
          },
          {
            actions: ['expand', 'scrollIntoView'],
          },
        ],
        'TRIGGER.EXPAND': {
          actions: ['expand', 'scrollIntoView'],
        },
        'TRIGGER.COLLAPSE': {
          actions: ['collapse'],
        },
        'TRIGGER.FOCUS': {
          target: 'focused',
        },
      },
    },
    focused: {
      on: {
        'TRIGGER.CLICK': [
          {
            guard: 'isExpanded',
            actions: ['collapse'],
          },
          {
            actions: ['expand', 'scrollIntoView'],
          },
        ],
        'TRIGGER.EXPAND': {
          actions: ['expand', 'scrollIntoView'],
        },
        'TRIGGER.COLLAPSE': {
          actions: ['collapse'],
        },
        'TRIGGER.BLUR': {
          target: 'idle',
        },
      },
    },
  },

  implementations: {
    guards: {
      isExpanded: ({ context, event }) => context.get('value').includes(event.value),
    },

    actions: {
      // In single-select: clearing the array (no other items to manage)
      // In multiple: removing just this value from the array
      collapse({ context, prop, event }) {
        const current = context.get('value')
        // In multiple, remove just this value.
        const next = prop('multiple')
          ? current.filter((v: string) => v !== event.value)
          : []
        context.set('value', next)
      },

      // In single-select (L49-54): expand this, collapse all others
      //   → equivalent to replacing array with [event.value]
      // In multiple: add to existing array
      expand({ context, prop, event }) {
        const current = context.get('value')
        // If not multiselectable, replace entire array (collapses others implicitly).
        const next = prop('multiple')
          ? [...current, event.value]
          : [event.value]
        context.set('value', next)
      },

      // scroll it into view. Uses raf() because the framework hasn't re-rendered
      // yet when actions fire — the collapsed sibling content needs to be hidden
      // first so the viewport check is accurate.
      scrollIntoView({ scope, event }) {
        raf(() => {
          const triggerEl = scope.getById(dom.getItemTriggerId(scope, event.value))
          if (triggerEl && !isElementInViewport(triggerEl)) {
            triggerEl.scrollIntoView()
          }
        })
      },

      setValue({ context, event }) {
        context.set('value', event.value)
      },
    },
  },
})
