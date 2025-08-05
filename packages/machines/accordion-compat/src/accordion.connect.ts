import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { AccordionApi, AccordionSchema } from './accordion.types'
import { parts } from './accordion.anatomy'
import * as dom from './accordion.dom'

export function connect<T extends PropTypes>(
  service: Service<AccordionSchema>,
  normalize: NormalizeProps<T>,
): AccordionApi<T> {
  const { context, send, prop, scope } = service

  const isItemOpen = (id: string) => context.get('value').includes(id)

  return {
    value: context.get('value'),
    open(id) {
      send({ type: 'OPEN', id })
    },
    close(id) {
      send({ type: 'CLOSE', id })
    },
    toggle(id) {
      send({ type: 'TOGGLE', id })
    },
    isItemOpen,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-multiple': prop('multiple') ? 'true' : undefined,
      })
    },

    getItemProps({ value }) {
      return normalize.element({
        ...parts.item.attrs,
        'data-value': value,
      })
    },

    getTriggerProps({ value }) {
      const open = isItemOpen(value)
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope, value),
        'aria-controls': dom.getContentId(scope, value),
        'aria-expanded': open,
        'data-state': open ? 'open' : 'closed',
        'type': 'button',
        onClick() {
          send({ type: 'TOGGLE', id: value })
        },
        onKeyDown(event) {
          const triggers = dom.getAllTriggerEls(scope)
          const idx = triggers.indexOf(event.currentTarget as HTMLElement)
          if (idx === -1)
            return
          let next = idx
          switch (event.key) {
            case 'ArrowDown':
              next = (idx + 1) % triggers.length
              event.preventDefault()
              break
            case 'ArrowUp':
              next = (idx - 1 + triggers.length) % triggers.length
              event.preventDefault()
              break
            case 'Home':
              next = 0
              event.preventDefault()
              break
            case 'End':
              next = triggers.length - 1
              event.preventDefault()
              break
          }
          if (next !== idx)
            triggers[next]?.focus()
        },
      })
    },

    getContentProps({ value }) {
      const open = isItemOpen(value)
      // @ts-expect-error normalize.element expects a boolean for `hidden`, but 'until-found' is a valid value in this context
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope, value),
        'hidden': open ? false : 'until-found',
        'data-state': open ? 'open' : 'closed',
      })
    },
  }
}
