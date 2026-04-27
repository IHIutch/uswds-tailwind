import type { Service } from '@zag-js/core'
import type { EventKeyMap, NormalizeProps, PropTypes } from '@zag-js/types'
import type { ComboboxApi, ComboboxSchema, OptionProps, OptionState } from './combobox.types'
import { ariaAttr, dataAttr, getEventKey, isComposingEvent, isLeftClick } from '@zag-js/dom-query'
import { parts } from './combobox.anatomy'
import * as dom from './combobox.dom'

export function connect<T extends PropTypes>(
  service: Service<ComboboxSchema>,
  normalize: NormalizeProps<T>,
): ComboboxApi<T> {
  const { state, context, send, prop, scope, computed } = service

  const open = state.matches('open')
  const focused = state.matches('focused', 'open')
  const disabled = !!prop('disabled')
  const interactive = computed('isInteractive')
  const required = !!prop('required')
  const highlightedValue = context.get('highlightedValue')
  const filteredOptions = computed('filteredOptions')

  // Compute the ID of the currently highlighted option for aria-activedescendant
  const highlightedIndex = highlightedValue
    ? filteredOptions.findIndex(o => o.value === highlightedValue)
    : -1
  const highlightedOptionId
    = highlightedValue && highlightedIndex >= 0
      ? dom.getOptionId(scope, highlightedValue, highlightedIndex)
      : undefined

  // Compute status message for screen readers.
  const numOptions = filteredOptions.length
  const statusMessage = open
    ? numOptions
      ? `${numOptions} result${numOptions > 1 ? 's' : ''} available.`
      : 'No results.'
    : ''

  function getOptionState(props: OptionProps) {
    return {
      value: props.option.value,
      disabled: !!props.option.disabled,
      selected: context.get('value') === props.option.value,
      highlighted: highlightedValue === props.option.value,
    }
  }

  return {
    /* ----- State properties ----- */
    open,
    focused,
    value: context.get('value'),
    inputValue: context.get('inputValue'),
    highlightedValue,
    isPristine: context.get('isPristine'),
    filteredOptions,
    hasValue: computed('hasValue'),
    disabled,
    statusMessage,

    /* ----- Imperative methods ----- */
    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },
    setInputValue(value) {
      send({ type: 'INPUT_VALUE.SET', value })
    },
    clearValue() {
      send({ type: 'VALUE.CLEAR' })
    },
    setOpen(nextOpen) {
      const currentOpen = state.matches('open')
      if (currentOpen === nextOpen)
        return
      send({ type: nextOpen ? 'OPEN' : 'CLOSE' })
    },

    getOptionState,

    /* ----- Root props ----- */
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-state': open ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        'data-pristine': dataAttr(context.get('isPristine')),
        onFocusOut(event: any) {
          //   [COMBO_BOX](event) {
          //     if (!this.contains(event.relatedTarget)) {
          //       resetSelection(this); hideList(this);
          //     }
          //   }
          const rootEl = dom.getRootEl(scope)
          if (rootEl && !rootEl.contains(event.relatedTarget as Node)) {
            send({ type: 'FOCUS_OUTSIDE' })
          }
        },
        //   [COMBO_BOX]: keymap({ Escape: handleEscape })
        // handleEscape (lines 671-677): hideList + resetSelection + inputEl.focus()
        // Escape is handled at the root level so it works regardless of
        // whether physical focus is on the input or a list option.
        onKeyDown(event) {
          if (event.defaultPrevented)
            return
          if (!interactive)
            return
          const key = getEventKey(event)
          if (key === 'Escape') {
            send({ type: 'ESCAPE' })
            event.preventDefault()
          }
        },
      })
    },

    /* ----- Label props ----- */
    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'id': dom.getLabelId(scope),
        'htmlFor': dom.getInputId(scope),
        'data-disabled': dataAttr(disabled),
      })
    },

    /* ----- Control props ----- */
    // Wrapper around input + buttons
    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        'id': dom.getControlId(scope),
        'data-state': open ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        'data-focus': dataAttr(focused),
      })
    },

    /* ----- Input props ----- */
    // ArrowUp and Escape are NOT handled on the input — ArrowUp is on
    // LIST_OPTION elements (lines 864-872), Escape is on COMBO_BOX (lines 856-858).
    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'type': 'text',
        'role': 'combobox',
        'aria-autocomplete': 'list',
        'aria-owns': dom.getListboxId(scope),
        'aria-controls': dom.getListboxId(scope),
        'aria-expanded': open,
        //   inputEl.setAttribute("aria-activedescendant", nextEl.id)
        'aria-activedescendant': highlightedOptionId,
        'autoCapitalize': 'off',
        'autoComplete': 'off',
        disabled,
        required,
        'placeholder': prop('placeholder'),
        'aria-label': prop('ariaLabel'),
        'aria-labelledby': prop('ariaLabelledby'),
        'data-state': open ? 'open' : 'closed',
        'defaultValue': context.get('inputValue'),

        onClick(event) {
          if (event.defaultPrevented)
            return
          if (!interactive)
            return
          //   if (this.disabled) return; handleClickFromInput(this);
          // handleClickFromInput (lines 819-825): if (listEl.hidden) displayList()
          send({ type: 'INPUT.CLICK' })
        },

        onFocus() {
          if (disabled)
            return
          send({ type: 'INPUT.FOCUS' })
        },

        onBlur() {
          if (disabled)
            return
          send({ type: 'INPUT.BLUR' })
        },

        //   comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
        //   displayList(this);
        onChange(event) {
          send({ type: 'INPUT.CHANGE', value: event.currentTarget.value })
        },

        //   [INPUT]: keymap({ Enter: handleEnterFromInput,
        //     ArrowDown: handleDownFromInput, Down: handleDownFromInput })
        // Only ArrowDown and Enter — ArrowUp is handled on LIST_OPTION
        // (lines 864-872), Escape is handled on COMBO_BOX root (lines 856-858).
        onKeyDown(event) {
          if (event.defaultPrevented)
            return
          if (!interactive)
            return
          if (isComposingEvent(event))
            return

          const keymap: EventKeyMap = {
            ArrowDown(event) {
              send({ type: 'INPUT.ARROW_DOWN' })
              event.preventDefault()
            },
            Enter(event) {
              send({ type: 'INPUT.ENTER' })
              event.preventDefault()
            },
          }

          const key = getEventKey(event)
          const exec = keymap[key]
          exec?.(event)
        },
      })
    },

    /* ----- Trigger (toggle) button props ----- */
    // Created in enhanceComboBox (line 253)
    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(scope),
        'type': 'button',
        'tabIndex': -1,
        'aria-label': 'Toggle the dropdown list',
        'aria-expanded': open,
        'aria-controls': dom.getListboxId(scope),
        disabled,
        'data-disabled': dataAttr(disabled),
        'data-state': open ? 'open' : 'closed',

        onClick(event) {
          if (event.defaultPrevented)
            return
          if (!interactive)
            return
          if (!isLeftClick(event))
            return
          //   if (this.disabled) return; toggleList(this);
          // toggleList (lines 802-812): if hidden → displayList, else → hideList + focus input
          send({ type: 'TRIGGER.CLICK' })
        },

        // Prevent the button from stealing focus from the input
        onPointerDown(event) {
          if (!interactive)
            return
          if (!isLeftClick(event))
            return
          event.preventDefault()
        },
      })
    },

    /* ----- Clear button props ----- */
    // Created in enhanceComboBox (line 249)
    getClearTriggerProps() {
      return normalize.button({
        ...parts.clearTrigger.attrs,
        'id': dom.getClearTriggerId(scope),
        'type': 'button',
        'tabIndex': -1,
        'aria-label': 'Clear the select contents',
        'aria-controls': dom.getInputId(scope),
        disabled,
        'data-disabled': dataAttr(disabled),
        // Hidden when no value is selected (nothing to clear)
        'hidden': !context.get('value'),

        onClick(event) {
          if (event.defaultPrevented)
            return
          if (!interactive)
            return
          //   if (this.disabled) return; clearInput(this);
          // clearInput (lines 594-605): clear select + input, remove pristine, focus input
          send({ type: 'CLEAR.CLICK' })
        },

        // Prevent the button from stealing focus from the input
        onPointerDown(event) {
          if (!interactive)
            return
          if (!isLeftClick(event))
            return
          event.preventDefault()
        },
      })
    },

    /* ----- Listbox props ----- */
    // Created in enhanceComboBox (lines 255-262)
    getListboxProps() {
      return normalize.element({
        ...parts.listbox.attrs,
        'id': dom.getListboxId(scope),
        'role': 'listbox',
        'tabIndex': -1,
        'aria-labelledby': dom.getLabelId(scope),
        // and hideList (line 571): listEl.hidden = true
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        'data-empty': dataAttr(numOptions === 0),

        // Prevent listbox clicks from stealing focus from input
        onPointerDown(event) {
          if (!isLeftClick(event))
            return
          event.preventDefault()
        },
      })
    },

    /* ----- Option (list item) props ----- */
    // Built dynamically in displayList (lines 484-514)
    // Physical focus: the highlighted option receives .focus() (line 323) from the machine.
    // tabIndex roving: highlighted gets tabIndex="0" (line 306), others get "-1" (line 301).
    getOptionProps(props: OptionProps) {
      const optionState = getOptionState(props)
      const optionValue = optionState.value

      return normalize.element({
        ...parts.option.attrs,
        'id': dom.getOptionId(scope, optionValue, props.index),
        'role': 'option',
        //   nextEl.setAttribute("tabIndex", "0") (line 306)
        //   focusedOptionEl.setAttribute("tabIndex", "-1") (line 301)
        'tabIndex': optionState.highlighted ? 0 : -1,
        'aria-selected': ariaAttr(optionState.selected),
        'aria-setsize': numOptions,
        'aria-posinset': props.index + 1,
        'data-value': optionValue,
        // LIST_OPTION_FOCUSED_CLASS (line 21) → data-highlighted
        // LIST_OPTION_SELECTED_CLASS (line 22) → data-selected
        'data-highlighted': dataAttr(optionState.highlighted),
        'data-selected': dataAttr(optionState.selected),
        'data-disabled': dataAttr(optionState.disabled),

        //   if (this.disabled) return; selectItem(this);
        // selectItem (lines 579-587): set value, set input text, set pristine, hide, focus input
        onClick(event) {
          if (event.defaultPrevented)
            return
          if (optionState.disabled)
            return
          send({ type: 'ITEM.CLICK', value: optionValue })
        },

        //   handleMouseover: if not already focused, highlightOption
        //   with preventScroll=true (line 793)
        onPointerMove() {
          if (optionState.disabled)
            return
          if (optionState.highlighted)
            return
          send({ type: 'ITEM.POINTER_MOVE', value: optionValue })
        },

        //   ArrowUp/Up: handleUpFromListOption (lines 761-777)
        //   ArrowDown/Down: handleDownFromListOption (lines 725-734)
        //   Enter: handleEnterFromListOption (lines 751-754)
        //   " ": handleSpaceFromListOption (lines 741-744)
        //   "Shift+Tab": noop (line 871)
        // Physical focus is on this option, so keyboard events fire here.
        // Escape is handled at the root level COMBO_BOX (lines 856-858), not here.
        onKeyDown(event) {
          if (event.defaultPrevented)
            return
          if (optionState.disabled)
            return

          const key = getEventKey(event)
          const keymap: Record<string, () => void> = {
            ArrowDown() {
              send({ type: 'OPTION.ARROW_DOWN' })
              event.preventDefault()
            },
            ArrowUp() {
              send({ type: 'OPTION.ARROW_UP' })
              event.preventDefault()
            },
            Enter() {
              send({ type: 'OPTION.ENTER' })
              event.preventDefault()
            },
            ' ': function () {
              send({ type: 'OPTION.SPACE' })
              event.preventDefault()
            },
          }

          const exec = keymap[key]
          exec?.()
        },
      })
    },

    /* ----- Status props ----- */
    // Created in enhanceComboBox (line 263): role="status"
    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'id': dom.getStatusId(scope),
        'role': 'status',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      })
    },
  }
}
