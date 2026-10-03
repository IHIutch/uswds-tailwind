import type { Params } from '@zag-js/core'
import type { ComboboxOption, ComboboxSchema } from './combobox.types'
import { setup } from '@zag-js/core'
import { addDomEvent, contains, getEventTarget, raf } from '@zag-js/dom-query'
import * as dom from './combobox.dom'
import { buildFilteredOptions, getAdjacentOption } from './combobox.utils'

type SelectionParams = Pick<Params<ComboboxSchema>, 'scope' | 'context' | 'prop'>

const { createMachine } = setup<ComboboxSchema>()

function cancelFocus({ refs }: Pick<Params<ComboboxSchema>, 'refs'>) {
  refs.get('focusCleanup')?.()
  refs.set('focusCleanup', null)
}

function cancelScroll({ refs }: Pick<Params<ComboboxSchema>, 'refs'>) {
  refs.get('scrollCleanup')?.()
  refs.set('scrollCleanup', null)
}

function scheduleDomWork(scope: SelectionParams['scope'], work: () => boolean) {
  let observerCleanup: VoidFunction | null = null
  let frameCleanup: VoidFunction | null = raf(() => {
    frameCleanup = null
    if (!work())
      observerCleanup = dom.observePartMutations(scope, work)
  })
  return () => {
    frameCleanup?.()
    observerCleanup?.()
  }
}

function scheduleFocus({ scope, refs }: Pick<Params<ComboboxSchema>, 'scope' | 'refs'>, id: string) {
  cancelFocus({ refs })
  refs.set('focusCleanup', scheduleDomWork(scope, () => {
    const focused = dom.focusVisibleItem(scope, id)
    if (focused)
      refs.set('focusCleanup', null)
    return focused
  }))
}

function scheduleScroll({ scope, refs }: Pick<Params<ComboboxSchema>, 'scope' | 'refs'>, id: string | null) {
  cancelScroll({ refs })
  if (!id)
    return
  refs.set('scrollCleanup', scheduleDomWork(scope, () => {
    const scrolled = dom.scrollItemIntoView(scope, id)
    if (scrolled)
      refs.set('scrollCleanup', null)
    return scrolled
  }))
}

function commitValue({ scope, context, prop }: SelectionParams, value: string, label: string) {
  context.set('value', value)
  context.set('inputValue', label)
  context.set('isPristine', true)
  dom.syncNativeSelection(scope, value, label)
  prop('onValueChange')?.({ value, label })
}

function runResetSelection(p: SelectionParams) {
  const { scope, context, prop } = p
  const selectValue = context.get('value')
  const inputValueLower = (context.get('inputValue') || '').toLowerCase()
  if (selectValue) {
    const match = prop('options').find(o => o.value === selectValue)
    if (match) {
      if (inputValueLower !== match.label) {
        context.set('inputValue', match.label)
        dom.syncNativeInput(scope, match.label)
      }
      context.set('isPristine', true)
      return
    }
  }
  if (inputValueLower) {
    context.set('inputValue', '')
    dom.syncNativeInput(scope, '')
  }
}

function runCompleteSelection(p: SelectionParams) {
  const { context, prop } = p
  context.set('srStatusText', '')
  const inputValueLower = (context.get('inputValue') || '').toLowerCase()
  if (inputValueLower) {
    const match = prop('options').find(o => o.label.toLowerCase() === inputValueLower)
    if (match) {
      commitValue(p, match.value, match.label)
      return
    }
  }
  runResetSelection(p)
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
      focusCleanup: null,
      scrollCleanup: null,
    }
  },

  exit: ['cancelHighlightRafs'],

  effects: ['trackFocusOut', 'bridgeInitialDefaultValue'],

  context({ prop, bindable }) {
    const initialValue = prop('defaultValue') ?? ''
    const matchedOption = initialValue
      ? prop('options').find(o => o.value === initialValue)
      : undefined
    const initialInputValue = matchedOption?.label ?? ''
    const initialIsPristine = Boolean(matchedOption)

    return {
      value: bindable<string>(() => ({ defaultValue: initialValue })),
      inputValue: bindable<string>(() => ({ defaultValue: initialInputValue, sync: true })),
      highlightedId: bindable<string | null>(() => ({ defaultValue: null, sync: true })),
      isPristine: bindable<boolean>(() => ({ defaultValue: initialIsPristine, sync: true })),
      filteredOptions: bindable<ComboboxOption[]>(() => ({ defaultValue: [], sync: true })),
      srStatusText: bindable<string>(() => ({ defaultValue: '' })),
    }
  },

  on: {
    'VALUE.SET': {
      actions: ['commitSelection'],
    },
  },

  states: {
    closed: {
      tags: ['closed'],
      on: {
        'TRIGGER.CLICK': { target: 'open', actions: ['openList', 'focusInput'] },
        'INPUT.CLICK': { target: 'open', actions: ['openList'] },
        'INPUT.ARROW_DOWN': { target: 'open', actions: ['openList', 'scrollHighlightedIntoView', 'focusHighlightedOption'] },
        'INPUT.CHANGE': { target: 'open', actions: ['syncInputValue', 'openList'] },
        'INPUT.ENTER': { actions: ['completeSelection'] },
        'INTERACT_OUTSIDE': { actions: ['resetSelection'] },
        'ESCAPE': { actions: ['resetSelection', 'focusInput'] },
        'CLEAR.CLICK': { actions: ['clearSelection', 'focusInput'] },
      },
    },
    open: {
      tags: ['open'],
      on: {
        'TRIGGER.CLICK': { target: 'closed', actions: ['closeList', 'focusInput'] },
        'INPUT.ARROW_DOWN': { actions: ['scrollHighlightedIntoView', 'focusHighlightedOption'] },
        'ITEM.ARROW_DOWN': {
          guard: 'hasNextOption',
          actions: ['highlightNextOption', 'scrollHighlightedIntoView', 'focusHighlightedOption'],
        },
        'ITEM.ARROW_UP': [
          {
            guard: 'hasPrevOption',
            actions: ['highlightPrevOption', 'scrollHighlightedIntoView', 'focusHighlightedOption'],
          },
          {
            target: 'closed',
            actions: ['focusInput', 'closeList'],
          },
        ],
        'ITEM.POINTER_MOVE': { actions: ['highlightItem', 'focusHighlightedOption'] },
        'ITEM.SELECT': { target: 'closed', actions: ['commitSelection', 'closeList', 'focusInput'] },
        'INPUT.CHANGE': { actions: ['syncInputValue', 'openList'] },
        'INPUT.ENTER': { target: 'closed', actions: ['completeSelection', 'closeList'] },
        'INTERACT_OUTSIDE': { target: 'closed', actions: ['resetSelection', 'closeList'] },
        'ESCAPE': { target: 'closed', actions: ['closeList', 'resetSelection', 'focusInput'] },
        'CLEAR.CLICK': { actions: ['clearSelection', 'openList', 'focusInput'] },
      },
    },
  },

  implementations: {
    guards: {

      hasNextOption: ({ context, event }) => {
        if (!('id' in event))
          return false
        return Boolean(getAdjacentOption(context.get('filteredOptions'), event.id, 1))
      },
      hasPrevOption: ({ context, event }) => {
        if (!('id' in event))
          return false
        return Boolean(getAdjacentOption(context.get('filteredOptions'), event.id, -1))
      },
    },

    actions: {
      openList({ scope, context, prop, refs }) {
        // A list rebuild replaces positional option nodes. A queued focus for an
        // old id could otherwise land on a different occurrence after rerender.
        cancelFocus({ refs })
        const result = buildFilteredOptions({
          optionData: prop('options'),
          inputValueRaw: context.get('inputValue'),
          customFilter: prop('customFilter'),
          isPristine: context.get('isPristine'),
          disableFiltering: prop('disableFiltering'),
          selectValue: context.get('value'),
          baseId: dom.getOptionBaseId(scope),
        })
        context.set('filteredOptions', result.options)
        context.set('highlightedId', result.highlightedId)
        scheduleScroll({ scope, refs }, result.promotionId)

        context.set('srStatusText', result.srStatusText)
      },

      closeList({ scope, context, refs }) {
        cancelFocus({ refs })
        cancelScroll({ refs })
        context.set('srStatusText', '')
        context.set('highlightedId', null)
        const listEl = dom.getListEl(scope)
        if (listEl)
          listEl.scrollTop = 0
      },

      focusInput({ scope }) {
        dom.getInputEl(scope)?.focus()
      },

      highlightNextOption({ context, event }) {
        if (!('id' in event))
          return
        const next = getAdjacentOption(context.get('filteredOptions'), event.id, 1)
        if (!next)
          return
        context.set('highlightedId', next.id)
      },

      highlightPrevOption({ context, event }) {
        if (!('id' in event))
          return
        const prev = getAdjacentOption(context.get('filteredOptions'), event.id, -1)
        if (!prev)
          return
        context.set('highlightedId', prev.id)
      },

      highlightItem({ context, event }) {
        if (!('id' in event))
          return
        const id = event.id
        const opt = context.get('filteredOptions').find(o => o.id === id)
        if (!opt)
          return
        context.set('highlightedId', id)
      },

      scrollHighlightedIntoView({ scope, context, refs }) {
        const id = context.get('highlightedId')
        if (!id)
          return
        scheduleScroll({ scope, refs }, id)
      },

      focusHighlightedOption({ scope, context, refs, event }) {
        // The adapter already focused a mounted target during this keydown.
        // Invalidate every older lazy/frame request so a later keydown listener
        // can make a different focus choice without being overwritten.
        if ('focusHandled' in event && event.focusHandled) {
          cancelFocus({ refs })
          return
        }
        const id = context.get('highlightedId')
        if (!id)
          return
        scheduleFocus({ scope, refs }, id)
      },

      cancelHighlightRafs({ refs }) {
        cancelFocus({ refs })
        cancelScroll({ refs })
      },

      commitSelection({ scope, context, prop, event }) {
        if (!('value' in event))
          return
        const { value } = event
        const label = 'label' in event ? event.label : (prop('options').find(o => o.value === value)?.label ?? '')
        commitValue({ scope, context, prop }, value, label)
      },

      syncInputValue({ context, event }) {
        if (!('value' in event))
          return
        context.set('isPristine', false)
        context.set('inputValue', event.value)
      },

      completeSelection: runCompleteSelection,
      resetSelection: runResetSelection,

      clearSelection({ scope, context, prop }) {
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
      },
    },

    effects: {
      // Wait for lazy native parts before emitting initial select and input changes.
      bridgeInitialDefaultValue({ context, scope, prop }) {
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
            send({ type: 'INTERACT_OUTSIDE' })
        })
      },
    },
  },
})
