import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { DropdownApi, DropdownSchema } from './dropdown.types'
import { getPlacementStyles } from '@zag-js/popper'
import { parts } from './dropdown.anatomy'
import * as dom from './dropdown.dom'

function focusFirst(ctx: any) {
  const items = dom.getItemEls(ctx)
  items[0]?.focus()
}

function focusLast(ctx: any) {
  const items = dom.getItemEls(ctx)
  items[items.length - 1]?.focus()
}

function focusNext(ctx: any) {
  const items = dom.getItemEls(ctx)
  const idx = items.indexOf(document.activeElement as HTMLElement)
  const next = items[idx + 1] || items[0]
  next?.focus()
}

function focusPrev(ctx: any) {
  const items = dom.getItemEls(ctx)
  const idx = items.indexOf(document.activeElement as HTMLElement)
  const prev = items[idx - 1] || items[items.length - 1]
  prev?.focus()
}

export function connect<T extends PropTypes>(
  service: Service<DropdownSchema>,
  normalize: NormalizeProps<T>,
): DropdownApi<T> {
  const { state, send, scope, prop } = service

  const open = state.matches('open')

  const popperStyles = getPlacementStyles({
    ...prop('positioning'),
    placement: 'bottom',
  })

  return {
    open,
    setOpen(next) {
      if (open === next)
        return
      send({ type: next ? 'OPEN' : 'CLOSE' })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
        dir: prop('dir'),
        onFocusout(event: FocusEvent) {
          const related = event.relatedTarget as HTMLElement | null
          const root = dom.getRootEl(scope)
          if (root && related && !root.contains(related)) {
            send({ type: 'CLOSE' })
          }
        },
      })
    },

    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'dir': prop('dir'),
        'aria-controls': dom.getContentId(scope),
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'data-state': open ? 'open' : 'closed',
        onClick() {
          send({ type: 'TOGGLE' })
        },
        onKeyDown(event) {
          switch (event.key) {
            case 'Enter':
            case ' ': {
              event.preventDefault()
              send({ type: 'OPEN' })
              focusFirst(scope)
              break
            }
            case 'ArrowDown': {
              event.preventDefault()
              send({ type: 'OPEN' })
              focusFirst(scope)
              break
            }
            case 'ArrowUp': {
              event.preventDefault()
              send({ type: 'OPEN' })
              focusLast(scope)
              break
            }
            case 'Home': {
              event.preventDefault()
              send({ type: 'OPEN' })
              focusFirst(scope)
              break
            }
            case 'End': {
              event.preventDefault()
              send({ type: 'OPEN' })
              focusLast(scope)
              break
            }
          }
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'dir': prop('dir'),
        'role': 'menu',
        'hidden': !open,
        'tabIndex': 0,
        'data-state': open ? 'open' : 'closed',
        onKeyDown(event) {
          switch (event.key) {
            case 'Escape': {
              event.preventDefault()
              send({ type: 'CLOSE' })
              dom.getTriggerEl(scope)?.focus()
              break
            }
            case 'ArrowDown': {
              event.preventDefault()
              focusNext(scope)
              break
            }
            case 'ArrowUp': {
              event.preventDefault()
              focusPrev(scope)
              break
            }
            case 'Home': {
              event.preventDefault()
              focusFirst(scope)
              break
            }
            case 'End': {
              event.preventDefault()
              focusLast(scope)
              break
            }
          }
        },
        'style': popperStyles.floating,
      })
    },

    getItemProps() {
      return normalize.element({
        ...parts.item.attrs,
        role: 'menuitem',
        tabIndex: -1,
        dir: prop('dir'),
        onClick() {
          send({ type: 'CLOSE' })
          dom.getTriggerEl(scope)?.focus()
        },
        onKeyDown(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            (event.currentTarget as HTMLElement).click()
          }
        },
      })
    },
  }
}
