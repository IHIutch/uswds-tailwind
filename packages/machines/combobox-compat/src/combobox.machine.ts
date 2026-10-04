import type { Params } from '@zag-js/core'
import type { ComboboxItem, ComboboxSchema } from './combobox.types'
import { setup } from '@zag-js/core'
import { addDomEvent, AnimationFrame, contains, getEventTarget } from '@zag-js/dom-query'
import * as dom from './combobox.dom'
import { buildItems } from './combobox.utils'

type SelectionParams = Pick<Params<ComboboxSchema>, 'scope' | 'context' | 'prop'>

const { createMachine } = setup<ComboboxSchema>()

type DomWorkParams = Pick<Params<ComboboxSchema>, 'scope' | 'refs'>
type DomWorkKey = keyof ComboboxSchema['refs']

// Try after rendering, then wait for lazy parts if they are still missing.
function scheduleDomWork({ scope, refs }: DomWorkParams, key: DomWorkKey, id: string | null) {
  const frame = refs.get(key)
  if (!id) {
    frame.cancel()
    return
  }
  const work = () => key === 'focusFrame' ? dom.focusVisibleItem(scope, id) : dom.scrollItemIntoView(scope, id)
  frame.request(() => work() ? undefined : dom.observePartMutations(scope, work))
}

function setValue({ scope, context, prop }: SelectionParams, value: string, label: string) {
  context.set('value', value)
  context.set('inputValue', label)
  context.set('isPristine', true)
  dom.syncNativeSelection(scope, value, label)
  prop('onValueChange')?.({ value, label })
}

export const machine = createMachine({

  props({ props }) {
    return {
      disableFiltering: false,
      disabled: false,
      ariaDisabled: false,
      options: [],
      ...props,
    }
  },

  initialState() {
    return 'closed'
  },

  refs() {
    return {
      focusFrame: AnimationFrame.create(),
      scrollFrame: AnimationFrame.create(),
    }
  },

  exit: ['cancelHighlightWork'],

  effects: ['trackFocusOut', 'syncInitialValue'],

  context({ prop, bindable }) {
    const initialValue = prop('defaultValue') ?? ''
    const matchedOption = initialValue
      ? prop('options').find(o => o.value === initialValue)
      : undefined

    return {
      value: bindable<string>(() => ({ defaultValue: initialValue })),
      inputValue: bindable<string>(() => ({ defaultValue: matchedOption?.label ?? '', sync: true })),
      highlightedId: bindable<string | null>(() => ({ defaultValue: null, sync: true })),
      isPristine: bindable<boolean>(() => ({ defaultValue: Boolean(matchedOption), sync: true })),
      items: bindable<ComboboxItem[]>(() => ({ defaultValue: [], sync: true })),
    }
  },

  on: {
    'INPUT.CHANGE': { target: 'open', reenter: true, actions: ['setInputValue'] },
    'INPUT.ENTER': { target: 'closed', actions: ['completeSelection'] },
    'LAYER.INTERACT_OUTSIDE': { target: 'closed', actions: ['revertInputValue'] },
    'LAYER.ESCAPE': { target: 'closed', actions: ['revertInputValue', 'setInitialFocus'] },
    'VALUE.CLEAR': { actions: ['clearSelectedItems', 'setInitialFocus'] },
    'VALUE.SET': { actions: ['selectItem'] },
  },

  states: {
    closed: {
      tags: ['closed'],
      entry: ['resetList'],
      on: {
        'TRIGGER.CLICK': { target: 'open', actions: ['setInitialFocus'] },
        'INPUT.CLICK': { target: 'open' },
        'INPUT.ARROW_DOWN': { target: 'open' },
      },
    },
    open: {
      tags: ['open'],
      entry: ['syncItems'],
      on: {
        'TRIGGER.CLICK': { target: 'closed', actions: ['setInitialFocus'] },
        'INPUT.ARROW_DOWN': { actions: ['setHighlightedId'] },
        'HIGHLIGHTED_ID.SET': { actions: ['setHighlightedId'] },
        'CLOSE': { target: 'closed', actions: ['setInitialFocus'] },
        'ITEM.SELECT': { target: 'closed', actions: ['selectItem', 'setInitialFocus'] },
      },
    },
  },

  implementations: {
    actions: {
      syncItems({ scope, context, prop, refs, event, action }) {
        // A list rebuild replaces positional option nodes. A queued focus for an
        // old id could otherwise land on a different occurrence after rerender.
        refs.get('focusFrame').cancel()
        const result = buildItems({
          optionData: prop('options'),
          inputValueRaw: context.get('inputValue'),
          customFilter: prop('customFilter'),
          isPristine: context.get('isPristine'),
          disableFiltering: prop('disableFiltering'),
          selectValue: context.get('value'),
          baseId: dom.getItemBaseId(scope),
        })
        context.set('items', result.items)
        context.set('highlightedId', result.highlightedId)
        scheduleDomWork({ scope, refs }, 'scrollFrame', result.promotionId)

        if (event.type === 'INPUT.ARROW_DOWN')
          action(['setHighlightedId'])
      },

      resetList({ scope, context, action }) {
        action(['cancelHighlightWork'])
        context.set('highlightedId', null)
        const listEl = dom.getListEl(scope)
        if (listEl)
          listEl.scrollTop = 0
      },

      setInitialFocus({ scope }) {
        dom.getInputEl(scope)?.focus()
      },

      setHighlightedId({ context, scope, refs, event }) {
        const id = event.type === 'HIGHLIGHTED_ID.SET' ? event.id : context.get('highlightedId')
        if (!id || !context.get('items').some(item => item.id === id))
          return
        context.set('highlightedId', id)
        if (event.type === 'INPUT.ARROW_DOWN' || (event.type === 'HIGHLIGHTED_ID.SET' && event.scroll))
          scheduleDomWork({ scope, refs }, 'scrollFrame', id)
        // A consumer can redirect the adapter's synchronous focus attempt.
        // Cancel older requests without scheduling a second focus attempt.
        if ('focusHandled' in event && event.focusHandled)
          refs.get('focusFrame').cancel()
        else
          scheduleDomWork({ scope, refs }, 'focusFrame', id)
      },

      cancelHighlightWork({ refs }) {
        refs.get('focusFrame').cancel()
        refs.get('scrollFrame').cancel()
      },

      selectItem({ scope, context, prop, event }) {
        if (!('value' in event))
          return
        const { value } = event
        const label = 'label' in event ? event.label : (prop('options').find(o => o.value === value)?.label ?? '')
        setValue({ scope, context, prop }, value, label)
      },

      setInputValue({ context, event }) {
        if (!('value' in event))
          return
        context.set('isPristine', false)
        context.set('inputValue', event.value)
      },

      completeSelection(p) {
        const { context, prop, action } = p
        const inputValue = context.get('inputValue').toLowerCase()
        const match = inputValue ? prop('options').find(o => o.label.toLowerCase() === inputValue) : undefined
        if (match)
          setValue(p, match.value, match.label)
        else
          action(['revertInputValue'])
      },

      revertInputValue({ scope, context, prop }) {
        const value = context.get('value')
        const match = value ? prop('options').find(o => o.value === value) : undefined
        const label = match?.label ?? ''
        if (context.get('inputValue').toLowerCase() !== label) {
          context.set('inputValue', label)
          dom.syncNativeInput(scope, label)
        }
        if (match)
          context.set('isPristine', true)
      },

      clearSelectedItems({ scope, context, prop, state, action }) {
        const hadValue = Boolean(context.get('value'))
        if (hadValue) {
          context.set('value', '')
          dom.syncNativeSelect(scope, '')
        }
        if (context.get('inputValue')) {
          context.set('inputValue', '')
          dom.syncNativeInput(scope, '')
        }
        context.set('isPristine', false)
        if (hadValue)
          prop('onValueChange')?.({ value: '', label: '' })
        if (state.matches('open'))
          action(['syncItems'])
      },
    },

    effects: {
      // Wait for lazy native parts before emitting initial select and input changes.
      syncInitialValue({ context, scope, prop }) {
        const defaultValue = prop('defaultValue')
        if (!defaultValue || !prop('options').some(item => item.value === defaultValue))
          return

        const bridge = () => {
          const acceptedValue = context.get('value')
          if (!prop('options').some(item => item.value === acceptedValue))
            return false
          if (!dom.getHiddenSelectEl(scope) || !dom.getInputEl(scope))
            return false
          dom.syncNativeSelection(scope, acceptedValue, context.get('inputValue'))
          return true
        }

        if (bridge())
          return
        return dom.observePartMutations(scope, bridge)
      },

      // Native focusout bubbles across adapters; blur does not. Keep tracking
      // while closed so leaving the input still resets the selection.
      trackFocusOut({ scope, send }) {
        const doc = scope.getDoc()
        return addDomEvent(doc, 'focusout', (event) => {
          const rootEl = dom.getRootEl(scope)
          const target = getEventTarget<HTMLElement>(event)
          if (!rootEl || !target || !contains(rootEl, target))
            return
          if (!contains(rootEl, event.relatedTarget))
            send({ type: 'LAYER.INTERACT_OUTSIDE' })
        })
      },
    },
  },
})
