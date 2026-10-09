import type { Service } from '@zag-js/core'
import type { JSX, NormalizeProps, PropTypes } from '@zag-js/types'
import type { ComboboxApi, ComboboxItem, ComboboxSchema } from './combobox.types'
import { ariaAttr, dataAttr, isLeftClick, visuallyHiddenStyle } from '@zag-js/dom-query'
import { parts } from './combobox.anatomy'
import * as dom from './combobox.dom'
import { focusVisibleItem } from './combobox.utils'

// USWDS's keymap requires an exact Shift/Alt/Control/Meta combination.
type SourceModifierEvent = Pick<KeyboardEvent, 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'>

function sourcePlainModifierMatch(event: SourceModifierEvent) {
  return !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey
}

export function connect<T extends PropTypes>(
  service: Service<ComboboxSchema>,
  normalize: NormalizeProps<T>,
): ComboboxApi<T> {
  const { state, send, prop, context, scope } = service
  const open = state.hasTag('open')

  const value = context.get('value')
  const inputValue = context.get('inputValue')
  const highlightedIndex = context.get('highlightedIndex')
  const items = context.get('items')
  const count = items.length
  const srStatusText = open ? (count ? `${count} result${count > 1 ? 's' : ''} available.` : 'No results.') : ''

  // Never reference an option removed by a list rebuild.
  const activeDescendant = highlightedIndex !== null
    ? items[highlightedIndex]?.id
    : undefined

  const disabled = prop('disabled')
  const ariaDisabled = prop('ariaDisabled')

  // Duplicate values select the last rendered occurrence.
  const selectedId = value
    ? [...items].reverse().find(item => item.value === value)?.id
    : undefined

  // Focus mounted options during keydown; newly rendered options use the next frame.
  const focusNow = (index: number | null) => focusVisibleItem(scope, index)

  return {
    inputValue,
    items,
    srStatusText,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': open ? 'open' : 'closed',
        onKeyDown(event) {
          if (event.key === 'Escape' && sourcePlainModifierMatch(event)) {
            send({ type: 'LAYER.ESCAPE' })
          }
        },
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        id: dom.getLabelId(scope),
        htmlFor: dom.getInputId(scope),
      })
    },

    getHiddenSelectProps() {
      return normalize.select({
        ...parts.hiddenSelect.attrs,
        'id': dom.getHiddenSelectId(scope),
        'name': prop('name'),
        'aria-hidden': true,
        'tabIndex': -1,
        'style': visuallyHiddenStyle,
        // Silences React's controlled-select warning.
        onChange() {},
        value,
      })
    },

    getInputProps() {
      const onValueInput = (event: JSX.FormEvent<HTMLInputElement>) => {
        send({ type: 'INPUT.CHANGE', value: event.currentTarget.value })
      }

      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'type': 'text',
        'role': 'combobox',
        'aria-controls': dom.getListId(scope),
        'aria-autocomplete': 'list',
        'aria-expanded': open,
        'aria-activedescendant': activeDescendant,
        'aria-label': prop('aria-label'),
        'aria-labelledby': prop('aria-labelledby'),
        'aria-disabled': ariaAttr(ariaDisabled),
        'autoCapitalize': 'off',
        'autoComplete': 'off',
        'required': prop('required') || undefined,
        disabled,
        'placeholder': prop('placeholder'),
        'value': inputValue,
        onClick(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'INPUT.CLICK' })
        },
        // Native bridge change events must not be treated as input edits.
        'onInput': onValueInput,
        onKeyDown(event) {
          const key = event.key
          if (!sourcePlainModifierMatch(event))
            return
          if (key === 'Enter') {
            event.preventDefault()
            send({ type: 'INPUT.ENTER' })
          }
          else if (key === 'ArrowDown' || key === 'Down') {
            event.preventDefault()
            const destination = highlightedIndex ?? 0
            send({ type: 'INPUT.ARROW_DOWN', focusHandled: focusNow(destination) })
          }
        },
      })
    },

    getClearTriggerProps() {
      return normalize.button({
        ...parts.clearTrigger.attrs,
        'id': dom.getClearTriggerId(scope),
        'type': 'button',
        'aria-label': 'Clear the select contents',
        'aria-disabled': ariaAttr(ariaDisabled),
        'hidden': disabled || ariaDisabled,
        disabled,
        onPointerDown(event) {
          if (isLeftClick(event))
            event.preventDefault()
        },
        onClick(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'VALUE.CLEAR' })
        },
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'type': 'button',
        'tabIndex': -1,
        'aria-label': 'Toggle the dropdown list',
        'aria-disabled': ariaAttr(ariaDisabled),
        disabled,
        onPointerDown(event) {
          if (!disabled && event.pointerType !== 'touch' && isLeftClick(event))
            event.preventDefault()
        },
        onClick(event) {
          if (event.defaultPrevented)
            return
          send({ type: 'TRIGGER.CLICK' })
        },
      })
    },

    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        'id': dom.getListId(scope),
        'role': 'listbox',
        'aria-labelledby': dom.getLabelId(scope),
        'tabIndex': -1,
        'hidden': !open,
      })
    },

    getItemProps({ item }: { item: ComboboxItem }) {
      const index = items.findIndex(candidate => candidate.id === item.id)
      const highlighted = index === highlightedIndex
      const selected = item.id === selectedId
      const selectItem = () => send({ type: 'ITEM.SELECT', value: item.value, label: item.label })
      return normalize.element({
        ...parts.item.attrs,
        'id': item.id,
        'role': 'option',
        'aria-setsize': items.length,
        'aria-posinset': index + 1,
        'aria-selected': selected,
        'data-value': item.value,
        'data-highlighted': dataAttr(highlighted),
        'tabIndex': highlighted ? 0 : -1,
        onClick(event) {
          if (event.defaultPrevented)
            return
          selectItem()
        },
        onMouseOver() {
          if (highlighted)
            return
          send({ type: 'HIGHLIGHTED_INDEX.SET', index, scroll: false })
        },
        onKeyDown(event) {
          const key = event.key
          if (!sourcePlainModifierMatch(event))
            return
          if (key === 'ArrowUp' || key === 'Up') {
            if (open)
              event.preventDefault()
            const destination = index - 1
            if (destination >= 0)
              send({ type: 'HIGHLIGHTED_INDEX.SET', index: destination, scroll: true, focusHandled: focusNow(destination) })
            else
              send({ type: 'CLOSE' })
          }
          else if (key === 'ArrowDown' || key === 'Down') {
            event.preventDefault()
            const destination = index + 1
            if (destination < items.length)
              send({ type: 'HIGHLIGHTED_INDEX.SET', index: destination, scroll: true, focusHandled: focusNow(destination) })
          }
          else if (key === 'Enter' || key === ' ') {
            event.preventDefault()
            selectItem()
          }
        },
      })
    },

    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
      })
    },
  }
}
