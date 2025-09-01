import type { ComboboxOption, ComboboxSchema } from './combobox.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './combobox.dom'

export const machine = createMachine<ComboboxSchema>({
  props({ props }) {
    return {
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    const options = prop('options') || []

    return {
      value: bindable(() => ({ defaultValue: prop('value') || '' })),
      inputValue: bindable(() => ({ defaultValue: options.find(o => o.value === prop('value'))?.label || '' })),
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
      entry: ['syncInputWithSelection', 'filterOptions'],
      on: {
        FOCUS: { target: 'focused' },
        OPEN: { target: 'open' },
        INPUT_CHANGE: {
          target: 'open',
          actions: ['updateInputValue'],
        },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
      },
    },
    focused: {
      on: {
        BLUR: {
          target: 'idle',
          actions: ['resetInput'],
        },
        OPEN: { target: 'open' },
        INPUT_CHANGE: {
          target: 'open',
          actions: ['updateInputValue'],
        },
        KEY_DOWN: { actions: ['handleKeyDown'] },
        ARROW_DOWN: { actions: ['navigateNext'] },
        ARROW_UP: { actions: ['navigatePrev'] },
        ENTER: { actions: ['selectActiveOrMatch'] },
        ESCAPE: { actions: ['closeAndReset'] },
        TAB: { target: 'idle', actions: ['resetInput'] },
        SPACE: { actions: ['selectActiveOrMatch'] },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
        FOCUS_ITEM: { actions: ['focusItem'] },
      },
    },
    open: {
      entry: ['setOpen', 'filterOptions'],
      exit: ['setClosed'],
      on: {
        CLOSE: { target: 'focused' },
        BLUR: {
          target: 'idle',
          actions: ['resetInput'],
        },
        INPUT_CHANGE: { actions: ['updateInputValue'] },
        SELECT_OPTION: { actions: ['selectOption'] },
        CLEAR_SELECTION: { actions: ['clearSelection'] },
        KEY_DOWN: { actions: ['handleKeyDown'] },
        ARROW_DOWN: { actions: ['navigateNext'] },
        ARROW_UP: { actions: ['navigatePrev'] },
        ENTER: { actions: ['selectActiveOrMatch'] },
        ESCAPE: { actions: ['closeAndReset'] },
        TAB: { target: 'focused' },
        SPACE: { actions: ['selectActiveOrMatch'] },
        RESET_INPUT: { actions: ['resetInput'] },
        FOCUS_ITEM: { actions: ['focusItem'] },
      },
    },
  },

  implementations: {
    actions: {
      setOpen({ context }) {
        context.set('isOpen', true)
      },
      setClosed({ context }) {
        context.set('isOpen', false)
        context.set('activeIndex', -1)
      },
      updateInputValue({ context, event, prop }) {
        if ('value' in event) {
          context.set('inputValue', event.value)
          context.set('isDirty', true)
          const onInputChange = prop('onInputChange')
          if (onInputChange) {
            onInputChange(event.value)
          }
        }
      },
      syncInputWithSelection({ context, prop }) {
        const options = prop('options')
        const value = context.get('value')
        if (value !== '') {
          const selected = options?.find(o => o.value === value)
          if (selected) {
            context.set('inputValue', selected.label)
            context.set('isDirty', false)
          }
        }
        else {
          context.set('inputValue', '')
          context.set('isDirty', false)
        }
      },
      resetInput({ context, prop }) {
        const options = prop('options')
        const value = context.get('value')
        const onInputChange = prop('onInputChange')

        if (value !== '') {
          const selected = options?.find(o => o.value === value)
          if (selected) {
            context.set('inputValue', selected.label)
            context.set('isDirty', false)
            if (onInputChange)
              onInputChange(selected.label)
          }
        }
        else {
          context.set('inputValue', '')
          context.set('isDirty', false)
          if (onInputChange)
            onInputChange('')
        }
      },
      filterOptions({ context, prop }) {
        const inputValue = context.get('inputValue').toLowerCase()
        const options = prop('options') || []
        const disableFiltering = prop('disableFiltering')
        const isDirty = context.get('isDirty')
        const value = context.get('value')

        if (disableFiltering) {
          context.set('filteredOptions', options)
          if (!inputValue) {
            context.set('activeIndex', options.length > 0 ? 0 : -1)
          }
          else {
            const idx = options.findIndex(o =>
              o.label.toLowerCase().includes(inputValue) || o.value.toLowerCase().includes(inputValue),
            )
            context.set('activeIndex', idx >= 0 ? idx : -1)
          }
          return
        }

        if (!inputValue || !isDirty) {
          context.set('filteredOptions', options)
          if (!isDirty && value !== '') {
            const selectedIndex = options.findIndex(o => o.value === value)
            context.set('activeIndex', selectedIndex >= 0 ? selectedIndex : 0)
          }
          else {
            context.set('activeIndex', options.length > 0 ? 0 : -1)
          }
          return
        }

        const startsWith: ComboboxOption[] = []
        const contains: ComboboxOption[] = []
        for (const option of options as ComboboxOption[]) {
          const label = option.label.toLowerCase()
          const value = option.value.toLowerCase()
          if (label.startsWith(inputValue) || value.startsWith(inputValue)) {
            startsWith.push(option)
          }
          else if (label.includes(inputValue) || value.includes(inputValue)) {
            contains.push(option)
          }
        }
        const filtered = [...startsWith, ...contains]

        context.set('filteredOptions', filtered)
        context.set('activeIndex', -1)
      },
      selectOption({ context, event, prop, send, scope }) {
        if (!('option' in event))
          return

        const { option } = event
        const onInputChange = prop('onInputChange')

        context.set('value', option.value)
        context.set('inputValue', option.label)
        context.set('isDirty', false)

        if (onInputChange)
          onInputChange(option.label)

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
        const onInputChange = prop('onInputChange')
        if (onInputChange)
          onInputChange('')
      },
      handleKeyDown({ event, send }) {
        if (!('key' in event))
          return

        switch (event.key) {
          case 'ArrowDown':
            send({ type: 'ARROW_DOWN' })
            break
          case 'ArrowUp':
            send({ type: 'ARROW_UP' })
            break
          case 'Enter':
            send({ type: 'ENTER' })
            break
          case 'Escape':
            send({ type: 'ESCAPE' })
            break
          case 'Tab':
            send({ type: 'TAB' })
            break
          case ' ':
          case 'Space':
            send({ type: 'SPACE' })
            break
        }
      },

      navigateNext({ context, send, scope }) {
        const filteredOptions = context.get('filteredOptions')
        const activeIndex = context.get('activeIndex')
        const isOpen = context.get('isOpen')
        const inputEl = dom.getInputEl(scope)
        const isInputFocused = document.activeElement === inputEl

        if (!isOpen) {
          send({ type: 'OPEN' })
          if (filteredOptions.length > 0) {
            send({ type: 'FOCUS_ITEM', index: 0 })
          }
        }
        else if (isInputFocused && filteredOptions.length > 0) {
          const targetIndex = activeIndex >= 0 ? activeIndex : 0
          send({ type: 'FOCUS_ITEM', index: targetIndex })
        }
        else if (activeIndex >= 0 && activeIndex < filteredOptions.length - 1) {
          const nextIndex = activeIndex + 1
          send({ type: 'FOCUS_ITEM', index: nextIndex })
        }
        else if (activeIndex >= 0 && filteredOptions.length > 0) {
          send({ type: 'FOCUS_ITEM', index: activeIndex })
        }
      },

      navigatePrev({ context, send, scope }) {
        const activeIndex = context.get('activeIndex')

        if (activeIndex === 0) {
          const inputEl = dom.getInputEl(scope)
          if (inputEl) {
            inputEl.focus()
            context.set('activeIndex', -1)
          }
          send({ type: 'CLOSE' })
        }
        else if (activeIndex > 0) {
          send({ type: 'FOCUS_ITEM', index: activeIndex - 1 })
        }
      },

      selectActiveOrMatch({ context, send }) {
        const isOpen = context.get('isOpen')
        if (!isOpen)
          return

        const activeIndex = context.get('activeIndex')
        const filteredOptions = context.get('filteredOptions')
        const inputValue = context.get('inputValue')

        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          send({ type: 'SELECT_OPTION', option: filteredOptions[activeIndex] })
        }
        else {
          const exactMatch = filteredOptions.find(option =>
            option.label.toLowerCase() === inputValue.toLowerCase()
            || option.value.toLowerCase() === inputValue.toLowerCase(),
          )

          if (exactMatch) {
            send({ type: 'SELECT_OPTION', option: exactMatch })
          }
          else {
            send({ type: 'RESET_INPUT' })
            send({ type: 'CLOSE' })
          }
        }
      },

      closeAndReset({ send }) {
        send({ type: 'RESET_INPUT' })
        send({ type: 'CLOSE' })
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
            const itemEl = dom.getItemEl(scope, option?.value || '')
            if (itemEl) {
              itemEl.focus()
            }
          })
        }
      },
      setValue({ context, event, flush, prop, scope }) {
        flush(() => {
          const options = prop('options')

          const selected = options?.find(o => o.value === event.value)
          if (selected) {
            context.set('value', selected.value)
            context.set('inputValue', selected.label)
            context.set('isDirty', false)

            const selectEl = dom.getSelectEl(scope)
            if (selectEl && selectEl.value !== selected.value) {
              selectEl.value = selected.value
              selectEl.dispatchEvent(new Event('change', { bubbles: true }))
            }
          }
        })
      },
    },
  },
})
