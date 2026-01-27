import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { ComboboxApi, ComboboxOption, ComboboxSchema } from './combobox.types'
import { dataAttr, visuallyHiddenStyle } from '@zag-js/dom-query'
import { parts } from './combobox.anatomy'
import * as dom from './combobox.dom'

export function connect<T extends PropTypes>(
  service: Service<ComboboxSchema>,
  normalize: NormalizeProps<T>,
): ComboboxApi<T> {
  const { send, scope, context, prop } = service

  const isOpen = context.get('isOpen')
  const value = context.get('value')
  const inputValue = context.get('inputValue')
  const filteredOptions = context.get('filteredOptions')
  const activeIndex = context.get('activeIndex')
  const disabled = context.get('disabled')
  const showClearButton = prop('showClearButton')
  const showToggleButton = prop('showToggleButton')

  const hasSelection = value !== ''
  const noResults = filteredOptions.length === 0 && inputValue.length > 0

  return {
    isOpen,
    hasSelection,
    inputValue,
    value,
    filteredOptions,
    activeIndex,
    noResults,

    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': isOpen ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        'data-empty': dataAttr(noResults),
        // USWDS uses onFocusout. However, in React onFocusout is not supported and onBlur === onFocusout
        onBlur(event) {
          const related = event.relatedTarget
          const root = dom.getRootEl(scope)
          if (root && !root.contains(related)) {
            send({ type: 'CLOSE' })
          }
        },
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope),
        'htmlFor': dom.getInputId(scope),
        'data-disabled': dataAttr(disabled),
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'role': 'combobox',
        'aria-expanded': isOpen,
        'aria-autocomplete': 'list',
        'aria-owns': dom.getListId(scope),
        'aria-controls': dom.getListId(scope),
        'aria-activedescendant': activeIndex >= 0 && filteredOptions[activeIndex]
          ? dom.getItemId(scope, filteredOptions[activeIndex].value)
          : undefined,
        'placeholder': prop('placeholder'),
        disabled,
        'data-disabled': dataAttr(disabled),
        'value': inputValue,
        'autoComplete': 'off',
        'autoCapitalize': 'off',
        onFocus() {
          send({ type: 'FOCUS' })
        },
        // onBlur(event) {
        //   const relatedTarget = event.relatedTarget
        //   const comboboxEl = dom.getRootEl(scope)

        //   if (!comboboxEl?.contains(relatedTarget)) {
        //     send({ type: 'BLUR' })
        //   }
        // },
        onInput(event) {
          send({ type: 'INPUT_CHANGE', value: event.currentTarget.value })
        },
        onKeyDown(event) {
          send({
            type: 'KEY_DOWN',
            key: event.key,
          })
        },
        onClick() {
          if (!isOpen) {
            send({ type: 'OPEN' })
          }
        },
      })
    },

    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        'id': dom.getListId(scope),
        'role': 'listbox',
        'tabIndex': -1,
        'aria-labelledby': dom.getLabelId(scope),
        'data-disabled': dataAttr(disabled),
        'hidden': !isOpen,
        'data-state': isOpen ? 'open' : 'closed',
        'data-empty': dataAttr(noResults),
      })
    },

    getSelectProps() {
      return normalize.element({
        ...parts.select.attrs,
        'id': dom.getSelectId(scope),
        'aria-hidden': true,
        'tabIndex': -1,
        'value': value,
        'style': visuallyHiddenStyle,
      })
    },

    getItemProps(option: ComboboxOption, index: number) {
      const isActive = index === activeIndex
      const isSelected = value === option.value

      return normalize.button({
        ...parts.item.attrs,
        'id': dom.getItemId(scope, option.value),
        'role': 'option',
        'aria-selected': isSelected ? 'true' : 'false',
        'aria-setsize': filteredOptions.length,
        'aria-posinset': index + 1,
        'data-active': dataAttr(isActive),
        'data-selected': dataAttr(isSelected),
        // 'data-disabled': option.disabled ? '' : undefined,
        'data-value': option.value,
        'tabIndex': isActive ? 0 : -1,
        onPointerMove() {
          if (activeIndex !== index) {
            send({ type: 'FOCUS_ITEM', index })
          }
        },
        onClick() {
          send({ type: 'SELECT_OPTION', option })
        },
        onKeyDown(event) {
          send({
            type: 'KEY_DOWN',
            key: event.key,
          })
        },
      })
    },

    getEmptyItemProps() {
      return normalize.element({
        ...parts.emptyItem.attrs,
        'data-empty': dataAttr(noResults),
      })
    },

    getClearButtonProps() {
      return normalize.button({
        ...parts.clearButton.attrs,
        'id': dom.getClearButtonId(scope),
        'type': 'button',
        'aria-label': 'Clear the select contents',
        'data-disabled': dataAttr(disabled),
        'disabled': disabled || !hasSelection,
        'hidden': !showClearButton || !hasSelection,
        onClick() {
          send({ type: 'CLEAR_SELECTION' })
          const inputEl = dom.getInputEl(scope)
          if (inputEl) {
            inputEl.focus()
          }
        },
      })
    },

    getToggleButtonProps() {
      return normalize.button({
        ...parts.toggleButton.attrs,
        'id': dom.getToggleButtonId(scope),
        'type': 'button',
        'tabIndex': -1,
        'aria-label': 'Toggle the dropdown list',
        'data-disabled': dataAttr(disabled),
        disabled,
        'hidden': !showToggleButton,
        'data-state': isOpen ? 'open' : 'closed',
        onClick() {
          send({ type: isOpen ? 'CLOSE' : 'OPEN' })
        },
      })
    },
  }
}
