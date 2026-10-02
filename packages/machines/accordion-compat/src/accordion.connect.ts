import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { AccordionApi, AccordionSchema, ItemProps, ItemState } from './accordion.types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './accordion.anatomy'
import * as dom from './accordion.dom'

export function connect<T extends PropTypes>(
  service: Service<AccordionSchema>,
  normalize: NormalizeProps<T>,
): AccordionApi<T> {
  const { send, context, scope, prop } = service

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

  function setValue(value: string[]) {
    let nextValue = value
    if (!multiple && nextValue.length > 1) {
      // @ts-expect-error: TS doesn't know that `multiple` is false here, so it thinks `nextValue` could be empty.
      nextValue = [nextValue[0]]
    }

    send({ type: 'VALUE.SET', value: nextValue })
  }

  function getItemState(props: ItemProps): ItemState {
    return {
      expanded: value.includes(props.value),
    }
  }

  return {
    value,
    setValue,
    getItemState,
    show,
    hide,
    toggle,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'data-multiple': dataAttr(multiple),
        'id': dom.getRootId(scope),
      })
    },

    getItemProps(props) {
      const itemState = getItemState(props)

      return normalize.element({
        ...parts.item.attrs,
        'data-state': itemState.expanded ? 'open' : 'closed',
      })
    },

    getItemTriggerProps(props) {
      const { value } = props
      const itemState = getItemState(props)

      return normalize.button({
        ...parts.itemTrigger.attrs,
        'id': dom.getItemTriggerId(scope, value),
        'type': 'button',
        'aria-expanded': itemState.expanded,
        'aria-controls': dom.getItemContentId(scope, value),
        'data-state': itemState.expanded ? 'open' : 'closed',
        onClick() {
          send({ type: 'TRIGGER.CLICK', value })
        },
      })
    },

    getItemContentProps(props) {
      const itemState = getItemState(props)

      return normalize.element({
        ...parts.itemContent.attrs,
        'id': dom.getItemContentId(scope, props.value),
        'hidden': !itemState.expanded,
        'data-state': itemState.expanded ? 'open' : 'closed',
      })
    },
  }
}
