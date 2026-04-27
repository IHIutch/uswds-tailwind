import type { ComboboxOption, ComboboxSchema } from './combobox.types'
import { createMachine } from '@zag-js/core'
import { raf } from '@zag-js/dom-query'
import * as dom from './combobox.dom'

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function generateDynamicRegExp(filter: string, query: string = '', extras: Record<string, string> = {}) {
  let find = filter.replace(/\{\{(.*?)\}\}/g, (_m: string, $1: string) => {
    const key = $1.trim()
    const queryFilter = extras[key]
    if (key !== 'query' && queryFilter) {
      const matcher = new RegExp(queryFilter, 'i')
      const matches = query.match(matcher)
      if (matches) {
        return escapeRegExp(matches[1] ?? '')
      }
      return ''
    }
    return escapeRegExp(query)
  })

  find = `^(?:${find})$`
  return new RegExp(find, 'i')
}

function filterAndSortOptions(options: ComboboxOption[], inputValue: string, isPristine: boolean, disableFiltering: boolean, filter: string, filterExtras: Record<string, string>) {
  const query = inputValue.toLowerCase()
  const regex = generateDynamicRegExp(filter, query, filterExtras)

  // option must have value AND (disableFiltering OR isPristine OR empty query OR matches regex)
  const shouldInclude = (option: ComboboxOption) =>
    !!option.value
    && (disableFiltering || isPristine || !query || regex.test(option.text))

  // When filtering is disabled or pristine, preserve original order (no sorting)
  //   if (disableFiltering || isPristine) { options.push(option); return; }
  if (disableFiltering || isPristine) {
    return options.filter(shouldInclude)
  }

  // Two-tier sort: startsWith first, then contains
  const startsWithOptions: ComboboxOption[] = []
  const containsOptions: ComboboxOption[] = []

  for (const option of options) {
    if (shouldInclude(option)) {
      if (option.text.toLowerCase().startsWith(query)) {
        startsWithOptions.push(option)
      }
      else {
        containsOptions.push(option)
      }
    }
  }

  return [...startsWithOptions, ...containsOptions]
}

/* -----------------------------------------------------------------------------
 * Machine
 * ----------------------------------------------------------------------------- */

export const machine = createMachine<ComboboxSchema>({
  props({ props }) {
    return {
      options: [],
      filter: '.*{{query}}.*',
      disableFiltering: false,
      defaultValue: '',
      defaultInputValue: '',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ prop, bindable }) {
    // is set and matches an option, populate input with that option's text and
    // mark as pristine.
    const defaultValue = prop('defaultValue')
    const defaultInputValue = prop('defaultInputValue')
    let initialInputValue = defaultInputValue
    let initialPristine = false

    if (defaultValue) {
      const matchingOption = prop('options').find(o => o.value === defaultValue)
      if (matchingOption) {
        initialInputValue = initialInputValue || matchingOption.text
        initialPristine = true
      }
    }

    return {
      value: bindable<string>(() => ({
        defaultValue,
        value: prop('value'),
        onChange(value) {
          const option = prop('options').find(o => o.value === value) ?? null
          prop('onValueChange')?.({ value, option })
        },
      })),
      inputValue: bindable<string>(() => ({
        defaultValue: initialInputValue,
        value: prop('inputValue'),
        onChange(value) {
          prop('onInputValueChange')?.({ inputValue: value })
        },
      })),
      highlightedValue: bindable<string | null>(() => ({
        defaultValue: null,
      })),
      isPristine: bindable<boolean>(() => ({
        defaultValue: initialPristine,
      })),
    }
  },

  computed: {
    isInteractive: ({ prop }) => !prop('disabled'),
    hasValue: ({ context }) => context.get('value') !== '',
    filteredOptions: ({ prop, context }) =>
      filterAndSortOptions(
        prop('options'),
        context.get('inputValue'),
        context.get('isPristine'),
        prop('disableFiltering'),
        prop('filter'),
        prop('filterExtras') ?? {},
      ),
  },

  // Global events (handled in any state)
  on: {
    'VALUE.SET': {
      actions: ['setValue'],
    },
    'INPUT_VALUE.SET': {
      actions: ['setInputValue'],
    },
  },

  states: {
    /* -----------------------------------------------------------------------
     * idle: No focus, list hidden
     * ----------------------------------------------------------------------- */
    idle: {
      on: {
        'INPUT.FOCUS': {
          target: 'focused',
        },
        // Click on input from idle: focus fires first (idle → focused),
        // then click fires (focused → open). But handle here too for safety.
        // handleClickFromInput (lines 819-825)
        'INPUT.CLICK': {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        // toggleList (lines 802-812)
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['focusInput', 'invokeOnOpen'],
        },
        'OPEN': {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        'VALUE.CLEAR': {
          actions: ['clearValue', 'clearInputValue', 'clearPristine'],
        },
      },
    },

    /* -----------------------------------------------------------------------
     * focused: Input has focus, list hidden
     * ----------------------------------------------------------------------- */
    focused: {
      entry: ['clearHighlightedValue'],
      on: {
        // Click on input when focused: open list
        //   if (listEl.hidden) displayList()
        'INPUT.CLICK': {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        // User typed in input: clear pristine, open list with filtered results
        //   comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS); displayList(this);
        'INPUT.CHANGE': {
          target: 'open',
          actions: ['setInputValue', 'clearPristine', 'invokeOnOpen'],
        },
        // ArrowDown from focused input: open list and highlight first/selected
        //   if (listEl.hidden) displayList(); highlightOption(nextOptionEl);
        // This is the ONLY open trigger that sets highlightedValue AND
        // distinction between "list open with focus on input" (typing/click)
        // vs "list open with focus on option" (ArrowDown).
        'INPUT.ARROW_DOWN': {
          target: 'open',
          actions: ['highlightFirstOrSelected', 'focusOption', 'invokeOnOpen'],
        },
        // Enter from focused input (list hidden): complete selection
        'INPUT.ENTER': {
          actions: ['completeSelection'],
        },
        // Escape from focused input: reset to last valid selection
        // hideList is no-op when already hidden
        'ESCAPE': {
          actions: ['resetSelection'],
        },
        // Focus left the input
        'INPUT.BLUR': {
          target: 'idle',
        },
        // Focus left the combobox entirely
        //   if (!this.contains(event.relatedTarget)) { resetSelection; hideList; }
        'FOCUS_OUTSIDE': {
          target: 'idle',
          actions: ['resetSelection'],
        },
        // Toggle button clicked while list is closed: open list
        //   if (listEl.hidden) displayList()
        'TRIGGER.CLICK': {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        // Clear button clicked: clear value + input, remove pristine
        // When list is hidden: no re-display
        'CLEAR.CLICK': {
          actions: ['clearValue', 'clearInputValue', 'clearPristine', 'focusInput'],
        },
        'OPEN': {
          target: 'open',
          actions: ['invokeOnOpen'],
        },
        'VALUE.CLEAR': {
          actions: ['clearValue', 'clearInputValue', 'clearPristine'],
        },
      },
    },

    open: {
      on: {
        // User typed while list is open: update input, clear pristine
        //   comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS); displayList(this);
        // filteredOptions recomputes automatically from new inputValue.
        // doesn't move focus to an option.
        'INPUT.CHANGE': {
          actions: ['setInputValue', 'clearPristine', 'clearHighlightedValue'],
        },
        // ArrowDown from input while list is open
        //   const nextOptionEl = listEl.querySelector(LIST_OPTION_FOCUSED) ||
        //                        listEl.querySelector(LIST_OPTION);
        //   highlightOption(comboBoxEl, nextOptionEl);
        // Highlights first/selected option and physically focuses it.
        'INPUT.ARROW_DOWN': {
          actions: ['highlightNextItem', 'focusOption'],
        },
        // Enter from input while list is open
        //   completeSelection(comboBoxEl); if (listShown) hideList(comboBoxEl);
        // selectItem only happens from Enter on a LIST_OPTION (physical focus).
        'INPUT.ENTER': {
          target: 'focused',
          actions: ['completeSelection', 'invokeOnClose'],
        },

        // --- Option keyboard events (physical focus on list option, lines 864-872) ---

        // ArrowDown from a focused option
        //   const nextOptionEl = focusedOptionEl.nextSibling;
        //   if (nextOptionEl) highlightOption(focusedOptionEl, nextOptionEl);
        // Moves to next option. Does nothing if at last option (no wrap).
        'OPTION.ARROW_DOWN': {
          actions: ['highlightNextItem', 'focusOption'],
        },
        // ArrowUp from a focused option
        //   const nextOptionEl = focusedOptionEl.previousSibling;
        //   highlightOption(comboBoxEl, nextOptionEl);
        //   if (!nextOptionEl) hideList(comboBoxEl);
        // Moves to previous option, or closes list if at first option.
        'OPTION.ARROW_UP': [
          {
            guard: 'isFirstItemHighlighted',
            target: 'focused',
            actions: ['clearHighlightedValue', 'focusInput', 'invokeOnClose'],
          },
          {
            actions: ['highlightPrevItem', 'focusOption'],
          },
        ],
        // Enter from a focused option
        //   selectItem(event.target)
        // selectItem (lines 579-587) updates value, input text, sets pristine,
        // hides list, and focuses input.
        'OPTION.ENTER': {
          target: 'focused',
          actions: ['selectHighlightedItem', 'focusInput', 'invokeOnClose'],
        },
        // Space from a focused option
        //   selectItem(event.target)
        // Identical behavior to Enter on a list option.
        'OPTION.SPACE': {
          target: 'focused',
          actions: ['selectHighlightedItem', 'focusInput', 'invokeOnClose'],
        },

        //   hideList(comboBoxEl); resetSelection(comboBoxEl); inputEl.focus();
        'ESCAPE': {
          target: 'focused',
          actions: ['resetSelection', 'clearHighlightedValue', 'focusInput', 'invokeOnClose'],
        },

        // --- Mouse/pointer events ---

        // Click on a list option: select it and close
        // selectItem calls inputEl.focus() at the end (line 586).
        'ITEM.CLICK': {
          target: 'focused',
          actions: ['selectItem', 'focusInput', 'invokeOnClose'],
        },
        // Mouseover on a list option: highlight and physically focus it
        //   highlightOption(listOptionEl, listOptionEl, { preventScroll: true })
        // Physical focus moves to the hovered option with preventScroll.
        'ITEM.POINTER_MOVE': {
          actions: ['setHighlightedValue', 'focusOptionPreventScroll'],
        },

        // --- Button events ---

        // Toggle button clicked while list is open: close list
        //   else { hideList(comboBoxEl); } inputEl.focus();
        'TRIGGER.CLICK': {
          target: 'focused',
          actions: ['focusInput', 'invokeOnClose'],
        },
        // Clear button clicked while list is open: clear and re-filter
        //   clear values + remove pristine + if (listShown) displayList
        // List stays open with full options.
        'CLEAR.CLICK': {
          actions: ['clearValue', 'clearInputValue', 'clearPristine', 'clearHighlightedValue', 'focusInput'],
        },

        // --- Focus/programmatic events ---

        // Focus left the combobox entirely
        //   if (!this.contains(event.relatedTarget)) { resetSelection; hideList; }
        'FOCUS_OUTSIDE': {
          target: 'idle',
          actions: ['resetSelection', 'clearHighlightedValue', 'invokeOnClose'],
        },
        // Programmatic close
        'CLOSE': {
          target: 'focused',
          actions: ['invokeOnClose'],
        },
        // Programmatic clear
        'VALUE.CLEAR': {
          target: 'focused',
          actions: ['clearValue', 'clearInputValue', 'clearPristine', 'invokeOnClose'],
        },
      },
    },
  },

  implementations: {
    guards: {
      //   if (!nextOptionEl) { hideList(comboBoxEl); }
      isFirstItemHighlighted: ({ context, computed }) => {
        const highlighted = context.get('highlightedValue')
        const filtered = computed('filteredOptions')
        return (
          highlighted != null
          && filtered.length > 0
          && filtered[0]!.value === highlighted
        )
      },
      noHighlightedItem: ({ context }) => context.get('highlightedValue') == null,
      hasHighlightedItem: ({ context }) => context.get('highlightedValue') != null,
    },

    effects: {
      // Scroll the listbox to keep the highlighted option visible.
      //   if (optionBottom > currentBottom) scrollTop = optionBottom - listHeight
      //   if (nextEl.offsetTop < scrollTop) scrollTop = nextEl.offsetTop
      scrollToHighlightedItem({ context, scope }) {
        const inputEl = dom.getInputEl(scope)
        if (!inputEl)
          return

        // Why MutationObserver instead of inline scroll in actions:
        // on the input (line 305) and then immediately scrolls (lines 309-319)
        // in the same synchronous call. In the machine model, actions update
        // context (highlightedValue) but the DOM isn't updated until connect
        // runs. A MutationObserver on aria-activedescendant reacts to the same
        // between "the highlight moved" and "scroll to it" — just async instead
        // of synchronous. The alternative (scrolling in raf() from actions)
        // would decouple scroll from the actual DOM change entirely.
        const observer = new MutationObserver(() => {
          const highlightedValue = context.get('highlightedValue')
          if (!highlightedValue)
            return

          const listboxEl = dom.getListboxEl(scope)
          if (!listboxEl)
            return

          // Find the highlighted option element by its data-value attribute
          const optionEl = listboxEl.querySelector(
            `[role=option][data-value="${CSS.escape(highlightedValue)}"]`,
          ) as HTMLElement | null
          if (!optionEl)
            return

          const optionBottom = optionEl.offsetTop + optionEl.offsetHeight
          const currentBottom = listboxEl.scrollTop + listboxEl.offsetHeight

          if (optionBottom > currentBottom) {
            listboxEl.scrollTop = optionBottom - listboxEl.offsetHeight
          }

          if (optionEl.offsetTop < listboxEl.scrollTop) {
            listboxEl.scrollTop = optionEl.offsetTop
          }
        })

        // Watch for aria-activedescendant changes on the input
        // (which is set by connect based on highlightedValue)
        observer.observe(inputEl, {
          attributes: true,
          attributeFilter: ['aria-activedescendant'],
        })

        return () => {
          observer.disconnect()
        }
      },
    },

    actions: {
      /* ----- Input value management ----- */

      setInputValue({ context, event }) {
        context.set('inputValue', event.value)
      },
      clearInputValue({ context }) {
        context.set('inputValue', '')
      },

      /* ----- Pristine flag management ----- */

      clearPristine({ context }) {
        context.set('isPristine', false)
      },

      /* ----- Highlighted value management ----- */

      clearHighlightedValue({ context }) {
        context.set('highlightedValue', null)
      },
      setHighlightedValue({ context, event }) {
        if (event.value == null)
          return
        context.set('highlightedValue', event.value)
      },
      highlightFirstOrSelected({ context, computed }) {
        const value = context.get('value')
        const filtered = computed('filteredOptions')

        if (value) {
          const hasSelected = filtered.some(o => o.value === value)
          if (hasSelected) {
            context.set('highlightedValue', value)
            return
          }
        }

        if (filtered.length > 0) {
          context.set('highlightedValue', filtered[0]!.value)
        }
        else {
          context.set('highlightedValue', null)
        }
      },
      highlightNextItem({ context, computed }) {
        const highlighted = context.get('highlightedValue')
        const filtered = computed('filteredOptions')
        if (filtered.length === 0)
          return

        if (highlighted == null) {
          context.set('highlightedValue', filtered[0]!.value)
          return
        }

        const currentIndex = filtered.findIndex(o => o.value === highlighted)
        if (currentIndex < 0 || currentIndex >= filtered.length - 1) {
          // Not found or at last item: do nothing (no wrap)
          return
        }

        context.set('highlightedValue', filtered[currentIndex + 1]!.value)
      },
      highlightPrevItem({ context, computed }) {
        const highlighted = context.get('highlightedValue')
        const filtered = computed('filteredOptions')
        if (filtered.length === 0 || highlighted == null)
          return

        const currentIndex = filtered.findIndex(o => o.value === highlighted)
        if (currentIndex <= 0)
          return

        context.set('highlightedValue', filtered[currentIndex - 1]!.value)
      },

      /* ----- Selection ----- */

      selectItem({ context, prop, event }) {
        const value = event.value as string
        const option = prop('options').find(o => o.value === value)
        if (!option)
          return

        context.set('value', value)
        context.set('inputValue', option.text)
        context.set('isPristine', true)
      },
      selectHighlightedItem({ context, prop }) {
        const highlighted = context.get('highlightedValue')
        if (!highlighted)
          return

        const option = prop('options').find(o => o.value === highlighted)
        if (!option)
          return

        context.set('value', highlighted)
        context.set('inputValue', option.text)
        context.set('isPristine', true)
      },
      completeSelection({ context, prop }) {
        const inputValue = context.get('inputValue').toLowerCase()
        const options = prop('options')

        if (inputValue) {
          for (const option of options) {
            if (option.text.toLowerCase() === inputValue) {
              context.set('value', option.value)
              context.set('inputValue', option.text)
              context.set('isPristine', true)
              return
            }
          }
        }

        // No exact match found — fall through to resetSelection logic
        const currentValue = context.get('value')
        if (currentValue) {
          const currentOption = options.find(o => o.value === currentValue)
          if (currentOption) {
            context.set('inputValue', currentOption.text)
            context.set('isPristine', true)
            return
          }
        }

        // No current selection: clear input
        if (context.get('inputValue')) {
          context.set('inputValue', '')
        }
      },
      resetSelection({ context, prop }) {
        const currentValue = context.get('value')
        const options = prop('options')

        if (currentValue) {
          const currentOption = options.find(o => o.value === currentValue)
          if (currentOption) {
            const currentInput = context.get('inputValue').toLowerCase()
            if (currentInput !== currentOption.text.toLowerCase()) {
              context.set('inputValue', currentOption.text)
            }
            context.set('isPristine', true)
            return
          }
        }

        // No value or option not found: clear input
        if (context.get('inputValue')) {
          context.set('inputValue', '')
        }
      },

      /* ----- Value management (programmatic) ----- */

      clearValue({ context }) {
        context.set('value', '')
      },
      setValue({ context, event }) {
        context.set('value', event.value)
      },

      /* ----- Focus management ----- */

      focusInput({ scope }) {
        raf(() => {
          dom.focusInputEl(scope)
        })
      },
      focusOption({ context, scope }) {
        const value = context.get('highlightedValue')
        if (!value)
          return
        raf(() => {
          dom.focusOptionEl(scope, value)
        })
      },
      focusOptionPreventScroll({ context, scope }) {
        const value = context.get('highlightedValue')
        if (!value)
          return
        raf(() => {
          dom.focusOptionEl(scope, value, true)
        })
      },

      /* ----- Callbacks ----- */

      invokeOnOpen({ prop }) {
        prop('onOpenChange')?.({ open: true })
      },
      invokeOnClose({ prop }) {
        prop('onOpenChange')?.({ open: false })
      },
    },
  },
})
