import type { ComboboxOption, ComboboxSchema } from './combobox.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './combobox.dom'

/* -----------------------------------------------------------------------------
 * Helper functions
 * ----------------------------------------------------------------------------- */

function findSelectedOption(options: ComboboxOption[], value: string): ComboboxOption | undefined {
  return options.find(o => o.value === value)
}

function findSelectedIndex(options: ComboboxOption[], value: string): number {
  const index = options.findIndex(o => o.value === value)
  return index >= 0 ? index : 0
}

/* -----------------------------------------------------------------------------
 * Machine definition
 * ----------------------------------------------------------------------------- */

export const machine = createMachine<ComboboxSchema>({
  props({ props }) {
    return {
      ...props,
      showToggleButton: props.showToggleButton ?? true,
      showClearButton: props.showClearButton ?? true,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    const options = prop('options') || []
    const initialValue = prop('value') || ''
    const initialLabel = findSelectedOption(options, initialValue)?.label || ''

    return {
      value: bindable(() => ({ defaultValue: initialValue })),
      disabled: bindable(() => ({ defaultValue: prop('disabled') || false })),
      inputValue: bindable(() => ({ defaultValue: initialLabel })),
      filteredOptions: bindable(() => ({ defaultValue: options })),
      activeIndex: bindable(() => ({ defaultValue: -1 })),
      isOpen: bindable(() => ({ defaultValue: false })),
      isDirty: bindable(() => ({ defaultValue: false })),
    }
  },

  watch({ track, action, context }) {
    track([() => context.get('inputValue')], () => {
      action(['filterOptions'])
    })
  },

  on: {
    'VALUE.SET': {
      actions: ['setValue'],
    },
  },

  states: {
    idle: {
      entry: ['setClosed', 'syncInputWithSelection'],
      on: {
        FOCUS: { target: 'focused' },
        OPEN: { target: 'open' },
        INPUT_CHANGE: { target: 'open', actions: ['updateInputValue'] },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
      },
    },
    focused: {
      on: {
        CLOSE: { target: 'idle' },
        OPEN: { target: 'open' },
        INPUT_CHANGE: { target: 'open', actions: ['updateInputValue'] },
        KEY_DOWN: { actions: ['handleKeyDown'] },
        ARROW_DOWN: { actions: ['navigateNext'] },
        ENTER: { actions: ['selectActiveOrMatch'] },
        ESCAPE: { actions: ['handleEscape'] },
        SPACE: { actions: ['selectActiveOrMatch'] },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
        RESET_INPUT: { actions: ['syncInputWithSelection'] },
        FOCUS_ITEM: { actions: ['focusItem'] },
      },
    },
    open: {
      entry: ['setOpen', 'filterOptions'],
      on: {
        CLOSE: { target: 'idle' },
        INPUT_CHANGE: { actions: ['updateInputValue'] },
        SELECT_OPTION: { actions: ['selectOption'] },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
        KEY_DOWN: { actions: ['handleKeyDown'] },
        ARROW_DOWN: { actions: ['navigateNext'] },
        ARROW_UP: { actions: ['navigatePrev'] },
        ENTER: { actions: ['selectActiveOrMatch'] },
        ESCAPE: { target: 'focused', actions: ['handleEscape'] },
        SPACE: { actions: ['selectActiveOrMatch'] },
        RESET_INPUT: { actions: ['syncInputWithSelection'] },
        FOCUS_ITEM: { actions: ['focusItem'] },
      },
    },
  },

  implementations: {
    actions: {
      setOpen({ context, prop }) {
        context.set('isOpen', true)

        const value = context.get('value')
        const options = prop('options') || []
        const targetIndex = value ? findSelectedIndex(options, value) : 0

        context.set('activeIndex', targetIndex)
      },

      setClosed({ context, prop }) {
        const options = prop('options') || []

        context.set('isOpen', false)
        context.set('activeIndex', -1)
        context.set('filteredOptions', options)
      },

      updateInputValue({ context, event, prop }) {
        context.set('inputValue', event.value)
        context.set('isDirty', true)
        prop('onInputChange')?.(event.value)
      },

      syncInputWithSelection({ context, prop }) {
        const options = prop('options') || []
        const value = context.get('value')
        const selected = value ? findSelectedOption(options, value) : undefined

        context.set('inputValue', selected?.label || '')
        context.set('isDirty', false)
        context.set('activeIndex', -1)
      },

      filterOptions({ context, prop, scope }) {
        const inputValue = context.get('inputValue').toLowerCase()
        const options = prop('options') || []
        const disableFiltering = prop('disableFiltering')
        const customFilter = prop('customFilter')
        const isDirty = context.get('isDirty')
        const value = context.get('value')

        // Normalize filter: customFilter or default startsWith/contains
        const defaultFilter = (query: string, opts: ComboboxOption[]): number => {
          if (!query)
            return opts.length > 0 ? 0 : -1
          const idx = opts.findIndex(o =>
            o.label.toLowerCase().includes(query) || o.value.toLowerCase().includes(query),
          )
          return idx >= 0 ? idx : -1
        }

        const handleFilter = customFilter ?? defaultFilter

        // When filtering is disabled, show all options and scroll to match
        if (disableFiltering) {
          const matchIndex = handleFilter(inputValue, options)
          context.set('filteredOptions', options)
          context.set('activeIndex', matchIndex)

          if (matchIndex >= 0) {
            raf(() => {
              const option = options[matchIndex]
              if (option) {
                dom.getItemEl(scope, option.value)?.scrollIntoView({ block: 'nearest' })
              }
            })
          }
          return
        }

        // When input is empty or unchanged, maintain selection context
        if (!inputValue || !isDirty) {
          const activeIndex = (!isDirty && value)
            ? findSelectedIndex(options, value)
            : (options.length > 0 ? 0 : -1)
          context.set('filteredOptions', options)
          context.set('activeIndex', activeIndex)
          return
        }

        // Filter options: keep those that match, set first as active
        const filtered = options.filter(o => handleFilter(inputValue, [o]) >= 0)
        context.set('filteredOptions', filtered)
        context.set('activeIndex', filtered.length > 0 ? 0 : -1)
      },
      selectOption({ context, event, prop, send, scope }) {
        if (!('option' in event))
          return

        const { option } = event

        context.set('value', option.value)
        context.set('inputValue', option.label)
        context.set('isDirty', false)
        prop('onInputChange')?.(option.label)

        // Sync hidden select element for form submission
        const selectEl = dom.getSelectEl(scope)
        if (selectEl) {
          selectEl.value = option.value
          selectEl.dispatchEvent(new Event('change', { bubbles: true }))
        }

        send({ type: 'CLOSE' })
      },

      clearSelection({ context, prop }) {
        context.set('value', '')
        context.set('inputValue', '')
        context.set('isDirty', false)
        prop('onInputChange')?.('')
      },
      handleKeyDown({ event, send }) {
        if (!('key' in event))
          return

        type KeyboardEventType = 'ARROW_DOWN' | 'ARROW_UP' | 'ENTER' | 'ESCAPE' | 'SPACE'
        const keyMap: Record<string, KeyboardEventType> = {
          'ArrowDown': 'ARROW_DOWN',
          'ArrowUp': 'ARROW_UP',
          'Enter': 'ENTER',
          'Escape': 'ESCAPE',
          ' ': 'SPACE',
          'Space': 'SPACE',
        }

        const eventType = keyMap[event.key]
        if (eventType)
          send({ type: eventType })
      },

      navigateNext({ context, send, scope }) {
        const filteredOptions = context.get('filteredOptions')
        const activeIndex = context.get('activeIndex')
        const isOpen = context.get('isOpen')
        const inputEl = dom.getInputEl(scope)
        const isInputFocused = document.activeElement === inputEl
        const hasOptions = filteredOptions.length > 0

        // Open the list if closed
        if (!isOpen) {
          send({ type: 'OPEN' })
          if (hasOptions)
            send({ type: 'FOCUS_ITEM', index: 0 })
          return
        }

        // Move focus from input to first/active item
        if (isInputFocused && hasOptions) {
          const targetIndex = activeIndex >= 0 ? activeIndex : 0
          send({ type: 'FOCUS_ITEM', index: targetIndex })
          return
        }

        // Navigate to next item (or stay at end)
        if (activeIndex >= 0 && hasOptions) {
          const nextIndex = Math.min(activeIndex + 1, filteredOptions.length - 1)
          send({ type: 'FOCUS_ITEM', index: nextIndex })
        }
      },

      navigatePrev({ context, send, scope }) {
        const activeIndex = context.get('activeIndex')
        const inputEl = dom.getInputEl(scope)
        const isInputFocused = document.activeElement === inputEl

        // Do nothing if input has focus
        if (isInputFocused)
          return

        // At first item: return focus to input and close
        if (activeIndex === 0) {
          inputEl?.focus()
          context.set('activeIndex', -1)
          send({ type: 'CLOSE' })
          return
        }

        // Navigate to previous item
        if (activeIndex > 0) {
          send({ type: 'FOCUS_ITEM', index: activeIndex - 1 })
        }
      },

      selectActiveOrMatch({ context, send }) {
        if (!context.get('isOpen'))
          return

        const activeIndex = context.get('activeIndex')
        const filteredOptions = context.get('filteredOptions')
        const inputValue = context.get('inputValue').toLowerCase()

        // Select the active item if one is focused
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          send({ type: 'SELECT_OPTION', option: filteredOptions[activeIndex] })
          return
        }

        // Try to find an exact match by label or value
        const exactMatch = filteredOptions.find(option =>
          option.label.toLowerCase() === inputValue || option.value.toLowerCase() === inputValue,
        )

        if (exactMatch) {
          send({ type: 'SELECT_OPTION', option: exactMatch })
        }
        else {
          send({ type: 'RESET_INPUT' })
          send({ type: 'CLOSE' })
        }
      },

      handleEscape({ context, send, scope }) {
        send({ type: 'RESET_INPUT' })
        context.set('isOpen', false)

        dom.getInputEl(scope)?.focus()
      },

      focusItem({ context, event, scope }) {
        if (!('index' in event))
          return

        const { index } = event
        const filteredOptions = context.get('filteredOptions')

        if (index >= 0 && index < filteredOptions.length) {
          context.set('activeIndex', index)

          raf(() => {
            const option = filteredOptions[index]
            if (option) {
              dom.getItemEl(scope, option.value)?.focus()
            }
          })
        }
      },

      setValue({ context, event, flush, prop, scope }) {
        flush(() => {
          const options = prop('options') || []
          const selected = findSelectedOption(options, event.value)

          if (!selected)
            return

          context.set('value', selected.value)
          context.set('inputValue', selected.label)
          context.set('isDirty', false)

          // Sync hidden select element for form submission
          const selectEl = dom.getSelectEl(scope)
          if (selectEl && selectEl.value !== selected.value) {
            selectEl.value = selected.value
            selectEl.dispatchEvent(new Event('change', { bubbles: true }))
          }
        })
      },
    },
  },
})
