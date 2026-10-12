import type { Params } from '@zag-js/core'
import type { DatePickerSchema, DateView, EndpointIndex } from './date-picker.types'
import { createGuards, createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { raf, setElementValue, trackFormControl } from '@zag-js/dom-query'
import * as dom from './date-picker.dom'
import {
  getDayKeyTarget,
  getEffectiveDateBounds,
  getMonthYearKeyTarget,
  getNavigationAvailability,
  isDateInputInvalid,
  normalizeDates,
  parseInputValue,
  serializeDates,
  setRangeEndpoint,
  VALIDATION_MESSAGE,
  YEAR_CHUNK,
} from './date-picker.utils'
import {
  addMonths,
  addYears,
  clamp,
  createDate,
  DEFAULT_EXTERNAL_DATE_FORMAT,
  formatDate,
  isAfter,
  isMonthInInterval,
  isSameDay,
  isWithinInterval,
  isYearInInterval,
  parseDateString,
  setMonth,
  setYear,
  startOfDay,
  startOfToday,
} from './date-utils'

function isDateEqual(a: Date | null | undefined, b: Date | null | undefined) {
  if (a == null || b == null)
    return a === b
  return isSameDay(a, b)
}
function isDateArrayEqual(a: (Date | undefined)[], b: (Date | undefined)[] | undefined) {
  if (b === undefined || a.length !== b.length)
    return false
  return a.every((date, index) => isDateEqual(date, b[index]))
}

const { and } = createGuards<DatePickerSchema>()

export const machine = createMachine<DatePickerSchema>({
  props({ props }) {
    const propMin = props.min ? startOfDay(props.min) : createDate(0, 0, 1)
    const propMax = props.max ? startOfDay(props.max) : undefined
    // USWDS rejects conflicting bounds only when both were supplied.
    if (props.min && props.max && propMax && isAfter(propMin, propMax))
      throw new Error('Minimum date cannot be after maximum date')
    return {
      ...props,
      selectionMode: props.selectionMode || 'single',
      min: propMin,
      max: propMax,
      defaultDate: props.defaultDate ? startOfDay(props.defaultDate) : undefined,
      rangeAnchor: props.rangeAnchor ? startOfDay(props.rangeAnchor) : undefined,
    }
  },

  initialState() {
    return 'idle'
  },

  exit: ['cancelFocusRaf'],

  refs() {
    return {
      focusRafCleanup: null,
      inputSyncCleanup: null,
      explicitInputs: new Set(),
    }
  },

  computed: {
    valueAsString: ({ context }) => serializeDates(context.get('value')),
    // A range endpoint cannot cross its peer.
    inputBounds: ({ context, prop }) => {
      const isRange = prop('selectionMode') === 'range'
      const value = context.get('value')
      return [
        getEffectiveDateBounds(isRange, 0, value, prop('min'), prop('max')),
        getEffectiveDateBounds(isRange, 1, value, prop('min'), prop('max')),
      ]
    },
    activeBounds: ({ context, computed }) => computed('inputBounds')[context.get('activeIndex')],
    navigation: ({ context, computed }) => {
      const bounds = computed('activeBounds')
      return getNavigationAvailability(context.get('focusedValue'), context.get('focusedYear'), bounds.start, bounds.end)
    },
  },

  context({ prop, bindable, getContext }) {
    return {
      value: bindable<(Date | undefined)[]>(() => {
        const controlledValue = prop('value')
        return {
          defaultValue: normalizeDates(prop('defaultValue') ?? []),
          value: controlledValue ? normalizeDates(controlledValue) : undefined,
          isEqual: isDateArrayEqual,
          hash: value => serializeDates(value).join(','),
          onChange(value) {
            prop('onValueChange')?.({
              value,
              valueAsString: serializeDates(value),
              view: getContext().get('view'),
            })
          },
        }
      }),
      focusedValue: bindable<Date>(() => ({
        defaultValue: startOfToday(),
        isEqual: isDateEqual,
      })),
      view: bindable<DateView>(() => ({
        defaultValue: 'day',
      })),
      hoveredValue: bindable<Date | null>(() => ({
        defaultValue: null,
        isEqual: isDateEqual,
      })),
      activeIndex: bindable<0 | 1>(() => ({ defaultValue: 0 })),
      inputValues: bindable<string[]>(() => ({
        defaultValue: [],
        hash: texts => JSON.stringify(texts),
      })),
      isOpeningRender: bindable<boolean>(() => ({
        defaultValue: false,
      })),
      focusedYear: bindable<number>(() => ({
        defaultValue: 0,
      })),
      focusedMonth: bindable<number>(() => ({
        defaultValue: 0,
      })),
    }
  },

  effects: ['syncInputsOnMount', 'trackFormControl'],

  watch({ track, context, event, action }) {
    // Any change to what the calendar shows ends the opening announcement, as USWDS's calendarWasHidden does.
    // A key that cannot move changes nothing, so hover, status and focus stay put.
    track([() => context.hash('focusedValue'), () => context.get('focusedMonth'), () => context.get('focusedYear'), () => context.get('view')], () => {
      const { type } = event.current()
      if (type === 'TRIGGER.CLICK' || type === 'OPEN')
        return
      action(['clearOpeningRender'])
      if (type.startsWith('TABLE.') && type !== 'TABLE.ESCAPE')
        action(['clearHoveredDate', 'focusActiveCell'])
    })
    track([() => context.hash('value')], () => {
      action(['syncInputElement'])
    })
    track([() => context.hash('inputValues')], () => {
      action(['syncInputValue'])
    })
  },

  on: {
    'VALUE.SET': {
      actions: ['setDateValue'],
    },
    'INPUT.CHANGE': [
      {
        // USWDS re-renders an open calendar for every parsable draft, even an unchanged date.
        guard: 'hasParsableInput',
        actions: ['setInputValue', 'selectParsedDate', 'clearHoveredDate', 'focusParsedDate', 'resetView', 'clearOpeningRender', 'restoreCalendarFocus'],
      },
      {
        actions: ['setInputValue', 'selectParsedDate'],
      },
    ],
    'INPUT.BLUR': {
      actions: ['validateInput'],
    },
    'INPUT.ENTER': {
      actions: ['validateInput'],
    },
  },

  states: {
    idle: {
      on: {
        'TRIGGER.CLICK': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setActiveIndex', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
        },
        'OPEN': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setActiveIndex', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
        },
        'TABLE.ESCAPE': {
          actions: ['focusInputElement'],
        },
      },
    },

    open: {
      effects: ['trackDismissableElement'],
      entry: ['focusActiveCell'],
      on: {
        'CELL.CLICK': [
          {
            guard: 'isSelectableViewCell',
            actions: ['setFocusedValueForView', 'clearHoveredDate', 'resetView', 'focusActiveCell'],
          },
          {
            target: 'idle',
            guard: 'isSelectableDate',
            actions: ['setSelectedDate', 'clearHoveredDate', 'focusInputElement', 'invokeOnOpenChange'],
          },
        ],
        'CELL.POINTER_MOVE': {
          guard: 'isChoosingRangeEnd',
          actions: ['setHoveredDate'],
        },
        'VIEW.SET': {
          actions: ['clearHoveredDate', 'setView', 'focusActiveCell'],
        },
        'TABLE.ARROW_LEFT': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.ARROW_RIGHT': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.ARROW_UP': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.ARROW_DOWN': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.HOME': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.END': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.PAGE_UP': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'TABLE.PAGE_DOWN': [
          { guard: 'isMonthView', actions: ['focusMonthCell'] },
          { guard: 'isYearView', actions: ['focusYearCell'] },
          { actions: ['focusDayCell'] },
        ],
        'GOTO.PREV': [
          { guard: and('isYearView', 'canGoPrev'), actions: ['focusPreviousYearChunk', 'clearHoveredDate', 'focusNavTrigger'] },
          { guard: 'canGoPrev', actions: ['focusPreviousPage', 'clearHoveredDate', 'focusNavTrigger'] },
        ],
        'GOTO.NEXT': [
          { guard: and('isYearView', 'canGoNext'), actions: ['focusNextYearChunk', 'clearHoveredDate', 'focusNavTrigger'] },
          { guard: 'canGoNext', actions: ['focusNextPage', 'clearHoveredDate', 'focusNavTrigger'] },
        ],
        // An open range calendar moves to the other endpoint instead of closing.
        'TRIGGER.CLICK': [
          {
            guard: 'isDifferentActiveIndex',
            actions: ['clearHoveredDate', 'setActiveIndex', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
          },
          {
            target: 'idle',
            guard: 'isInteractive',
            actions: ['invokeOnOpenChange'],
          },
        ],
        'OPEN': {
          guard: 'isDifferentActiveIndex',
          actions: ['clearHoveredDate', 'setActiveIndex', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
        },
        'CLOSE': {
          target: 'idle',
          actions: ['invokeOnOpenChange'],
        },
        'INTERACT_OUTSIDE': {
          target: 'idle',
          actions: ['invokeOnOpenChange'],
        },
        'TABLE.ESCAPE': {
          target: 'idle',
          actions: ['focusInputElement', 'invokeOnOpenChange'],
        },
      },
    },
  },

  implementations: {
    guards: {
      isInteractive: ({ prop }) => !prop('disabled') && !prop('readOnly'),
      isDifferentActiveIndex: ({ context, prop, event }) => prop('selectionMode') === 'range' && (event.index ?? 0) !== context.get('activeIndex'),
      isMonthView: ({ context, event }) => (event.view ?? context.get('view')) === 'month',
      isYearView: ({ context, event }) => (event.view ?? context.get('view')) === 'year',
      isSelectableDate: ({ computed, event }) => isWithinInterval(event.value, computed('activeBounds')),
      canGoPrev: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkPrev : computed('navigation').canGoPrev,
      canGoNext: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkNext : computed('navigation').canGoNext,
      hasParsableInput: ({ event }) => Boolean(parseDateString(event.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)),
      isSelectableViewCell: ({ context, computed, event }) => {
        const view = context.get('view')
        if (view === 'month')
          return isMonthInInterval(event.value, computed('activeBounds'))
        return view === 'year' && isYearInInterval(event.value, computed('activeBounds'))
      },
      isChoosingRangeEnd: ({ context, prop }) =>
        (prop('selectionMode') === 'range' && context.get('activeIndex') === 1 && Boolean(context.get('value')[0]) && !context.get('value')[1])
        || (prop('selectionMode') === 'single' && Boolean(prop('rangeAnchor')) && context.get('value').length === 0),
    },

    actions: {
      setDateValue(params) {
        const { context, prop, event } = params
        context.set('value', normalizeDates(event.value))
        scheduleInputSync(params, prop('selectionMode') === 'range' ? [0, 1] : [0])
      },

      setSelectedDate(params) {
        const { context, prop, event } = params
        const isRange = prop('selectionMode') === 'range'
        const index = isRange ? context.get('activeIndex') : 0
        const date = startOfDay(event.value)
        context.set('value', isRange ? setRangeEndpoint(context.get('value'), index, date) : [date])
        scheduleInputSync(params, [index])
      },

      setHoveredDate({ context, event }) {
        context.set('hoveredValue', startOfDay(event.value))
      },

      clearHoveredDate({ context }) {
        context.set('hoveredValue', null)
      },

      setActiveIndex({ context, event }) {
        context.set('activeIndex', event.index ?? 0)
      },

      // Opening uses the adjusted draft even when the raw input is invalid.
      setFocusedValueOnOpen({ scope, context, computed, prop, event }) {
        const index: EndpointIndex = event.index ?? 0
        const value = context.get('value')
        const input = dom.getInputEl(scope, index)
        let date = input ? parseDateString(input.value, DEFAULT_EXTERNAL_DATE_FORMAT, true) : undefined
        if (!date && prop('selectionMode') === 'range')
          date = value[index] ?? value[1 - index]
        if (!date && !input)
          date = value[index]
        context.set('focusedValue', clamp(date ?? prop('defaultDate') ?? startOfToday(), computed('inputBounds')[index]))
      },

      setInputValue({ context, event }) {
        const next = [...context.get('inputValues')]
        next[event.index] = event.value
        context.set('inputValues', next)
      },

      selectParsedDate({ context, computed, prop, event }) {
        const index: EndpointIndex = event.index
        const bounds = computed('inputBounds')[index]
        const date = parseInputValue(event.value, bounds.start, bounds.end)
        if (prop('selectionMode') === 'range')
          context.set('value', setRangeEndpoint(context.get('value'), index, date))
        else
          context.set('value', date ? [date] : [])
      },

      focusParsedDate({ context, computed, event }) {
        const date = parseDateString(event.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)!
        const index: EndpointIndex = event.index
        context.set('focusedValue', clamp(date, computed('inputBounds')[index]))
      },

      // Rebuilding the grid can blur its focused cell; restore calendar focus.
      restoreCalendarFocus({ scope, action }) {
        if (dom.getContentEl(scope)?.contains(scope.getActiveElement()))
          action(['focusActiveCell'])
      },

      validateInput(params) {
        const { context, event } = params
        applyInputValidity(params, event.index, context.get('inputValues')[event.index] ?? '')
      },

      syncInputValue(params) {
        syncInputValue(params, params.context.get('inputValues'))
      },

      syncInputElement(params) {
        scheduleInputSync(params)
      },

      resetView({ context }) {
        context.set('view', 'day')
      },

      markOpeningRender({ context }) {
        context.set('isOpeningRender', true)
      },

      clearOpeningRender({ context }) {
        context.set('isOpeningRender', false)
      },

      focusPreviousPage({ context, computed, event }) {
        const focusedValue = context.get('focusedValue')
        const target = event.unit === 'year' ? addYears(focusedValue, -1) : addMonths(focusedValue, -1)
        context.set('focusedValue', clamp(target, computed('activeBounds')))
      },

      focusNextPage({ context, computed, event }) {
        const focusedValue = context.get('focusedValue')
        const target = event.unit === 'year' ? addYears(focusedValue, 1) : addMonths(focusedValue, 1)
        context.set('focusedValue', clamp(target, computed('activeBounds')))
      },

      focusPreviousYearChunk({ context, computed }) {
        const target = setYear(context.get('focusedValue'), Math.max(0, context.get('focusedYear') - YEAR_CHUNK))
        context.set('focusedYear', clamp(target, computed('activeBounds')).getFullYear())
      },

      focusNextYearChunk({ context, computed }) {
        const target = setYear(context.get('focusedValue'), context.get('focusedYear') + YEAR_CHUNK)
        context.set('focusedYear', clamp(target, computed('activeBounds')).getFullYear())
      },

      // A newly disabled navigation button needs a focus fallback.
      focusNavTrigger({ scope, event, refs }) {
        const direction = event.type === 'GOTO.PREV' ? 'prev' : 'next'
        scheduleFocusFrame({ scope, refs }, () => {
          const button = dom.getNavTriggerEl(scope, direction, event.view, event.unit)
          if (button && !button.disabled)
            button.focus()
          else if (event.view === 'year')
            dom.getViewEl(scope, 'year')?.focus()
          else
            dom.getViewControlEl(scope)?.focus()
        })
      },

      setView({ context, event }) {
        const focusedValue = context.get('focusedValue')
        context.set('view', event.view)
        context.set('focusedYear', focusedValue.getFullYear())
        context.set('focusedMonth', focusedValue.getMonth())
      },

      setFocusedValueForView({ context, computed, event }) {
        context.set('focusedValue', clamp(event.value, computed('activeBounds')))
      },

      focusDayCell({ context, computed, event }) {
        const target = getDayKeyTarget(event.type, context.get('focusedValue'), event.larger)
        context.set('focusedValue', clamp(target, computed('activeBounds')))
      },

      focusMonthCell({ context, computed, event }) {
        const month = Math.max(0, Math.min(11, getMonthYearKeyTarget(event.type, context.get('focusedMonth'), 'month')))
        const target = setMonth(context.get('focusedValue'), month)
        context.set('focusedMonth', clamp(target, computed('activeBounds')).getMonth())
      },

      focusYearCell({ context, computed, event }) {
        const year = Math.max(0, getMonthYearKeyTarget(event.type, context.get('focusedYear'), 'year'))
        const target = setYear(context.get('focusedValue'), year)
        context.set('focusedYear', clamp(target, computed('activeBounds')).getFullYear())
      },

      invokeOnOpenChange({ prop, state }) {
        prop('onOpenChange')?.({ open: state.matches('open') })
      },

      focusInputElement({ scope, refs, context, prop }) {
        const index = prop('selectionMode') === 'range' ? context.get('activeIndex') : 0
        scheduleFocusFrame({ scope, refs }, () => {
          dom.getInputEl(scope, index)?.focus()
        })
      },

      focusActiveCell({ scope, refs, context }) {
        scheduleFocusFrame({ scope, refs }, () => {
          dom.getFocusedCell(scope, context.get('view'))?.focus()
        })
      },

      cancelFocusRaf({ refs }) {
        refs.get('focusRafCleanup')?.()
      },
    },

    effects: {
      // Set initial input values on mount. Vanilla spreadProps reapplies defaultValue each render and overwrites drafts.
      syncInputsOnMount(params) {
        // The inputValues watch does not fire for the first set.
        syncInputValue(params, updateInputValues(params, new Set([0, 1])))
        return () => params.refs.get('inputSyncCleanup')?.()
      },
      // A native reset empties the fields but not the machine. Unlike USWDS, the range bounds clear too.
      trackFormControl({ scope, send }) {
        return trackFormControl(dom.getInputEl(scope, 0), {
          // A disabled fieldset already disables the native inputs and buttons.
          onFieldsetDisabledChange() {},
          onFormReset() {
            send({ type: 'VALUE.SET', value: [] })
          },
        })
      },
      trackDismissableElement({ scope, send }) {
        return trackDismissableElement(() => dom.getContentEl(scope), {
          type: 'popover',
          defer: !dom.getContentEl(scope),
          exclude: () => dom.getRootEl(scope),
          onEscapeKeyDown(event) {
            event.preventDefault()
            send({ type: 'TABLE.ESCAPE' })
          },
          onDismiss() {
            send({ type: 'INTERACT_OUTSIDE' })
          },
        })
      },
    },
  },
})

// Focus runs after rendering; a newer request cancels the previous one.
function scheduleFocusFrame({ refs }: Pick<Params<DatePickerSchema>, 'scope' | 'refs'>, callback: () => void) {
  refs.get('focusRafCleanup')?.()
  refs.set('focusRafCleanup', raf(() => {
    refs.set('focusRafCleanup', null)
    callback()
  }))
}

type InputParams = Pick<Params<DatePickerSchema>, 'scope' | 'context' | 'prop' | 'refs' | 'computed'>

// Show each endpoint's date. Typing owns a focused draft unless a selection or setValue replaces it.
function updateInputValues(params: InputParams, explicit: ReadonlySet<EndpointIndex>) {
  const { scope, context } = params
  const next = [...context.get('inputValues')]
  for (const index of [0, 1] as const) {
    const input = dom.getInputEl(scope, index)
    if (!input)
      continue
    if (explicit.has(index) || !scope.isActiveElement(input)) {
      const date = context.get('value')[index]
      next[index] = date ? formatDate(date, DEFAULT_EXTERNAL_DATE_FORMAT) : ''
    }
    applyInputValidity(params, index, next[index] ?? '')
  }
  if (next.some((text, index) => text !== context.get('inputValues')[index]))
    context.set('inputValues', next)
  return next
}

// Skip unchanged text so typing, including IME composition, is never rewritten.
function syncInputValue({ scope }: InputParams, texts: readonly string[]) {
  texts.forEach((text, index) => {
    const input = dom.getInputEl(scope, index)
    if (input && input.value !== text)
      setElementValue(input, text)
  })
}

// Validation never replaces a message set by another validator.
function applyInputValidity(params: InputParams, index: EndpointIndex, text: string) {
  const input = dom.getInputEl(params.scope, index)
  if (!input)
    return
  const bounds = params.computed('inputBounds')[index]
  const invalid = isDateInputInvalid(text, bounds.start, bounds.end)
  if (invalid && !input.validationMessage)
    input.setCustomValidity(VALIDATION_MESSAGE)
  else if (!invalid && input.validationMessage === VALIDATION_MESSAGE)
    input.setCustomValidity('')
}

// Write after a frame so a controlled parent can accept or reject the value first.
function scheduleInputSync(params: InputParams, explicitIndexes: EndpointIndex[] = []) {
  const { refs } = params
  const explicit = refs.get('explicitInputs')
  explicitIndexes.forEach(index => explicit.add(index))
  refs.get('inputSyncCleanup')?.()
  refs.set('inputSyncCleanup', raf(() => {
    refs.set('inputSyncCleanup', null)
    updateInputValues(params, explicit)
    explicit.clear()
  }))
}
