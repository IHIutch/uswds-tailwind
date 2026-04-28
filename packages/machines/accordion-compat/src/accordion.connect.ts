import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { AccordionApi, AccordionSchema, ItemProps } from './accordion.types'
import { isSafari } from '@zag-js/dom-query'
import { parts } from './accordion.anatomy'
import * as dom from './accordion.dom'

export function connect<T extends PropTypes>(
  service: Service<AccordionSchema>,
  normalize: NormalizeProps<T>,
): AccordionApi<T> {
  const { state, context, send, prop, scope } = service

  const value = context.get('value')
  const multiple = prop('multiple')

  function show(itemValue: string) {
    send({ type: 'TRIGGER.EXPAND', value: itemValue })
  }

  function hide(itemValue: string) {
    send({ type: 'TRIGGER.COLLAPSE', value: itemValue })
  }

  function toggle(itemValue: string) {
    if (value.includes(itemValue)) {
      send({ type: 'TRIGGER.COLLAPSE', value: itemValue })
    }
    else {
      send({ type: 'TRIGGER.EXPAND', value: itemValue })
    }
  }

  function setValue(nextValue: string[]) {
    let coerced = nextValue
    if (!multiple && coerced.length > 1) {
      coerced = [coerced[0]!]
    }
    send({ type: 'VALUE.SET', value: coerced })
  }

  function getItemState(props: ItemProps) {
    return {
      expanded: value.includes(props.value),
    }
  }

  const focused = state.matches('focused')

  return {
    focused,
    value,
    setValue,
    getItemState,
    show,
    hide,
    toggle,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-allow-multiple': multiple || undefined,
      })
    },

    getItemProps(props) {
      const itemState = getItemState(props)
      return normalize.element({
        ...parts.item.attrs,
        'id': dom.getItemId(scope, props.value),
        'data-state': itemState.expanded ? 'open' : 'closed',
      })
    },

    getItemTriggerProps(props) {
      const { value: itemValue } = props
      const itemState = getItemState(props)

      return normalize.button({
        ...parts.itemTrigger.attrs,
        'type': 'button',
        'id': dom.getItemTriggerId(scope, itemValue),
        'aria-expanded': itemState.expanded,
        'aria-controls': dom.getItemContentId(scope, itemValue),
        // data-controls and data-ownedby used by dom.ts getTriggerEls
        // to filter buttons to this accordion instance
        'data-controls': dom.getItemContentId(scope, itemValue),
        'data-ownedby': dom.getRootId(scope),
        'data-state': itemState.expanded ? 'open' : 'closed',
        onClick(event) {
          // Safari doesn't focus buttons on click — normalize behavior
          if (isSafari()) {
            event.currentTarget.focus()
          }
          send({ type: 'TRIGGER.CLICK', value: itemValue })
        },
        onFocus() {
          send({ type: 'TRIGGER.FOCUS', value: itemValue })
        },
        onBlur() {
          send({ type: 'TRIGGER.BLUR', value: itemValue })
        },
      })
    },

    getItemContentProps(props) {
      const itemState = getItemState(props)
      return normalize.element({
        ...parts.itemContent.attrs,
        'role': 'region',
        'id': dom.getItemContentId(scope, props.value),
        'aria-labelledby': dom.getItemTriggerId(scope, props.value),
        'hidden': !itemState.expanded,
        'data-state': itemState.expanded ? 'open' : 'closed',
      })
    },
  }
}
