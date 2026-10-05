import type { Params } from '@zag-js/core'
import type { ComboboxItem, ComboboxSchema } from './combobox.types'
import { createMachine } from '@zag-js/core'
import { AnimationFrame } from '@zag-js/dom-query'
import { trackInteractOutside } from '@zag-js/interact-outside'
import * as dom from './combobox.dom'
import { buildItems, focusVisibleItem, scrollItemIntoView } from './combobox.utils'

type SelectionParams = Pick<Params<ComboboxSchema>, 'context' | 'flush'>

function setValue({ context, flush }: SelectionParams, value: string, label: string) {
  flush(() => {
    context.set('value', value)
    context.set('inputValue', label)
    context.set('isPristine', true)
  })
}

export const machine = createMachine<ComboboxSchema>({

  props({ props }) {
    return {
      filter: '.*{{query}}.*',
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

  effects: ['trackInteractOutside'],

  context({ prop, bindable }) {
    const initialValue = prop('defaultValue') ?? ''
    const matchedOption = initialValue
      ? prop('options').find(o => o.value === initialValue)
      : undefined

    return {
      value: bindable<string>(() => ({ defaultValue: initialValue })),
      inputValue: bindable<string>(() => ({ defaultValue: matchedOption?.label ?? '' })),
      highlightedIndex: bindable<number | null>(() => ({ defaultValue: null })),
      isPristine: bindable<boolean>(() => ({ defaultValue: Boolean(matchedOption) })),
      items: bindable<ComboboxItem[]>(() => ({ defaultValue: [] })),
    }
  },

  watch({ context, prop, scope, state, track, action }) {
    track([() => context.get('value')], () => {
      prop('onValueChange')?.({ value: context.get('value'), label: context.get('inputValue') })
    })
    track([() => context.get('inputValue')], () => {
      const inputEl = dom.getInputEl(scope)
      if (inputEl)
        inputEl.value = context.get('inputValue')
    })
    track([() => context.get('inputValue'), () => context.get('value'), () => context.get('isPristine')], () => {
      if (state.matches('open'))
        action(['syncItems'])
    })
  },

  on: {
    'INPUT.CHANGE': { target: 'open', actions: ['setInputValue'] },
    'INPUT.ENTER': { target: 'closed', actions: ['completeSelection'] },
    'LAYER.INTERACT_OUTSIDE': { target: 'closed', actions: ['revertInputValue'] },
    'LAYER.ESCAPE': { target: 'closed', actions: ['revertInputValue', 'focusInput'] },
    'VALUE.CLEAR': { actions: ['clearValue', 'focusInput'] },
    'VALUE.SET': { actions: ['selectItem'] },
  },

  states: {
    closed: {
      tags: ['closed'],
      entry: ['resetList'],
      on: {
        'TRIGGER.CLICK': { target: 'open', actions: ['focusInput'] },
        'INPUT.CLICK': { target: 'open' },
        'INPUT.ARROW_DOWN': { target: 'open' },
      },
    },
    open: {
      tags: ['open'],
      entry: ['syncItems'],
      on: {
        'TRIGGER.CLICK': { target: 'closed', actions: ['focusInput'] },
        'INPUT.ARROW_DOWN': { actions: ['setHighlightedIndex'] },
        'HIGHLIGHTED_INDEX.SET': { actions: ['setHighlightedIndex'] },
        'CLOSE': { target: 'closed', actions: ['focusInput'] },
        'ITEM.SELECT': { target: 'closed', actions: ['selectItem', 'focusInput'] },
      },
    },
  },

  implementations: {
    actions: {
      syncItems({ scope, context, prop, refs, event }) {
        // A list rebuild replaces positional option nodes. A queued focus for an
        // old index could otherwise land on a different occurrence after rerender.
        refs.get('focusFrame').cancel()
        const result = buildItems({
          optionData: prop('options'),
          inputValueRaw: context.get('inputValue'),
          customFilter: prop('customFilter'),
          filter: prop('filter'),
          filterExtras: prop('filterExtras'),
          isPristine: context.get('isPristine'),
          disableFiltering: prop('disableFiltering'),
          selectValue: context.get('value'),
        })
        const items = result.items.map((option, index) => ({
          id: dom.getItemId(scope, index),
          value: option.value,
          label: option.label,
        }))
        context.set('items', items)
        context.set('highlightedIndex', result.highlightedIndex)
        const arrowDown = event.type === 'INPUT.ARROW_DOWN'
        const scrollIndex = arrowDown ? result.highlightedIndex : result.promotionIndex
        refs.get('scrollFrame').request(() => {
          if (scrollIndex !== null)
            scrollItemIntoView(scope, scrollIndex)
        })
        if (arrowDown && !event.focusHandled)
          refs.get('focusFrame').request(() => { focusVisibleItem(scope, result.highlightedIndex) })
      },

      resetList({ scope, context, action }) {
        action(['cancelHighlightWork'])
        context.set('highlightedIndex', null)
        const listEl = dom.getListEl(scope)
        if (listEl)
          listEl.scrollTop = 0
      },

      focusInput({ scope }) {
        // Return focus before closing removes the focused USWDS option.
        dom.getInputEl(scope)?.focus()
      },

      setHighlightedIndex({ context, scope, refs, event }) {
        const index = event.type === 'HIGHLIGHTED_INDEX.SET' ? event.index : context.get('highlightedIndex')
        if (index === null || !context.get('items')[index])
          return
        context.set('highlightedIndex', index)
        if (event.type === 'INPUT.ARROW_DOWN' || (event.type === 'HIGHLIGHTED_INDEX.SET' && event.scroll))
          refs.get('scrollFrame').request(() => { scrollItemIntoView(scope, index) })
        // A consumer can redirect the adapter's synchronous focus attempt.
        // Cancel older requests without scheduling a second focus attempt.
        if ('focusHandled' in event && event.focusHandled) {
          refs.get('focusFrame').cancel()
        }
        else {
          refs.get('focusFrame').request(() => {
            focusVisibleItem(scope, index)
          })
        }
      },

      cancelHighlightWork({ refs }) {
        refs.get('focusFrame').cancel()
        refs.get('scrollFrame').cancel()
      },

      selectItem(params) {
        const { prop, event } = params
        if (!('value' in event))
          return
        const { value } = event
        const label = 'label' in event ? event.label : (prop('options').find(o => o.value === value)?.label ?? '')
        setValue(params, value, label)
      },

      completeSelection(params) {
        const { context, prop, action } = params
        const inputValue = context.get('inputValue').toLowerCase()
        const match = inputValue ? prop('options').find(o => o.label.toLowerCase() === inputValue) : undefined
        if (match)
          setValue(params, match.value, match.label)
        else
          action(['revertInputValue'])
      },

      revertInputValue({ context, prop }) {
        const value = context.get('value')
        const match = value ? prop('options').find(o => o.value === value) : undefined
        const label = match?.label ?? ''
        context.set('inputValue', label)
        if (match)
          context.set('isPristine', true)
      },

      setInputValue({ context, event }) {
        if (event.type !== 'INPUT.CHANGE')
          return
        context.set('inputValue', event.value)
        context.set('isPristine', false)
      },

      clearValue({ context, flush }) {
        flush(() => {
          context.set('value', '')
          context.set('inputValue', '')
          context.set('isPristine', false)
        })
      },
    },

    effects: {
      // Keep tracking while closed so leaving the input restores the selection.
      trackInteractOutside({ scope, send }) {
        return trackInteractOutside(() => dom.getRootEl(scope), {
          defer: true,
          onInteractOutside() {
            send({ type: 'LAYER.INTERACT_OUTSIDE' })
          },
        })
      },
    },
  },
})
