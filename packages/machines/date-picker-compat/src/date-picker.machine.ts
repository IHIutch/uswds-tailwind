import type { Params } from '@zag-js/core'
import type { DatePickerSchema, DateView, EndpointIndex } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import { raf } from '@zag-js/dom-query'
import * as dom from './date-picker.dom'
import {
  getDayKeyTarget,
  getEffectiveDateBounds,
  getMonthYearKeyTarget,
  getNavigationAvailability,
  normalizeDates,
  parseInputValue,
  serializeDates,
  setRangeEndpoint,
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
  isSameMonth,
  isSameYear,
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

// Focus runs after rendering; a newer request cancels the previous one.
function scheduleFocusFrame({ refs }: Pick<Params<DatePickerSchema>, 'scope' | 'refs'>, callback: () => void) {
  refs.get('focusRafCleanup')?.()
  refs.set('focusRafCleanup', raf(() => {
    refs.set('focusRafCleanup', null)
    callback()
  }))
}

type InputParams = Pick<Params<DatePickerSchema>, 'scope' | 'context' | 'prop' | 'refs'>

function rememberInputText({ context }: InputParams, index: number, text: string) {
  const inputValues = context.get('inputValues')
  if (inputValues[index] === text)
    return
  const next = [...inputValues]
  next[index] = text
  context.set('inputValues', next)
}

// Typing owns a focused input's text. Explicit writes come from selection and emit change even when unchanged.
function writeInput(params: InputParams, index: number, explicit: boolean) {
  const { scope, context, prop } = params
  const input = dom.getInputEl(scope, index)
  if (!input)
    return
  if (explicit || !scope.isActiveElement(input)) {
    const date = context.get('value')[index]
    const text = date ? formatDate(date, DEFAULT_EXTERNAL_DATE_FORMAT) : ''
    if (explicit || input.value !== text)
      dom.changeElementValue(input, text)
    rememberInputText(params, index, text)
  }
  const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
  dom.applyDateInputValidity(input, input.value, bounds.start, bounds.end)
}

// Write after a frame so a controlled parent can accept or reject the value first.
function scheduleInputSync(params: InputParams, explicitIndexes: EndpointIndex[] = []) {
  const { refs } = params
  const explicit = refs.get('explicitInputs')
  explicitIndexes.forEach(index => explicit.add(index))
  refs.get('inputSyncCleanup')?.()
  refs.set('inputSyncCleanup', raf(() => {
    refs.set('inputSyncCleanup', null)
    writeInput(params, 0, explicit.has(0))
    writeInput(params, 1, explicit.has(1))
    explicit.clear()
  }))
}

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
    activeBounds: ({ context, prop }) => getEffectiveDateBounds(
      prop('selectionMode') === 'range',
      context.get('activeIndex'),
      context.get('value'),
      prop('min'),
      prop('max'),
    ),
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

  effects: ['syncInputsOnMount'],

  watch({ track, context, action }) {
    track([() => context.hash('value')], () => {
      action(['syncInputElement'])
    })
  },

  on: {
    'VALUE.SET': {
      actions: ['setDateValue'],
    },
    'INPUT.CHANGE': {
      actions: ['commitInputValue', 'reconcileCalendar'],
    },
  },

  states: {
    idle: {
      on: {
        'TRIGGER.CLICK': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
        },
        'OPEN': {
          target: 'open',
          guard: 'isInteractive',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'invokeOnOpenChange'],
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
            actions: ['setFocusedValueForView', 'resetView', 'focusActiveCell'],
          },
          {
            target: 'idle',
            guard: 'isSelectableDate',
            actions: ['setDateValue', 'focusInputElement', 'invokeOnOpenChange'],
          },
        ],
        'CELL.POINTER_MOVE': { guard: 'isChoosingRangeEnd', actions: ['setHoveredDate'] },
        'VIEW.SET': { actions: ['setView', 'focusActiveCell'] },
        'TABLE.ARROW_LEFT': { actions: ['keyboardNav'] },
        'TABLE.ARROW_RIGHT': { actions: ['keyboardNav'] },
        'TABLE.ARROW_UP': { actions: ['keyboardNav'] },
        'TABLE.ARROW_DOWN': { actions: ['keyboardNav'] },
        'TABLE.HOME': { actions: ['keyboardNav'] },
        'TABLE.END': { actions: ['keyboardNav'] },
        'TABLE.PAGE_UP': { actions: ['keyboardNav'] },
        'TABLE.PAGE_DOWN': { actions: ['keyboardNav'] },
        'GOTO.PREV': { guard: 'canGoPrev', actions: ['applyNav', 'clearHoveredDate', 'focusNavTrigger'] },
        'GOTO.NEXT': { guard: 'canGoNext', actions: ['applyNav', 'clearHoveredDate', 'focusNavTrigger'] },
        'TRIGGER.CLICK': [
          {
            guard: 'isDifferentActiveIndex',
            actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
          },
          {
            target: 'idle',
            guard: 'isInteractive',
            actions: ['invokeOnOpenChange'],
          },
        ],
        'OPEN': {
          guard: 'isDifferentActiveIndex',
          actions: ['clearHoveredDate', 'setFocusedValueOnOpen', 'resetView', 'markOpeningRender', 'focusActiveCell'],
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
      isSelectableDate: ({ computed, event }) => {
        const bounds = computed('activeBounds')
        return isWithinInterval(event.value, bounds)
      },
      canGoPrev: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkPrev : computed('navigation').canGoPrev,
      canGoNext: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkNext : computed('navigation').canGoNext,
      isSelectableViewCell: ({ context, computed, event }) => {
        const view = context.get('view')
        if (view === 'day')
          return false
        const bounds = computed('activeBounds')
        if (view === 'month')
          return isMonthInInterval(event.value, bounds)
        return isYearInInterval(event.value, bounds)
      },
      isChoosingRangeEnd: ({ context, prop }) =>
        (prop('selectionMode') === 'range' && context.get('activeIndex') === 1 && Boolean(context.get('value')[0]) && !context.get('value')[1])
        || (prop('selectionMode') === 'single' && Boolean(prop('rangeAnchor')) && context.get('value').length === 0),
    },

    actions: {
      setDateValue(params) {
        const { context, prop, event } = params
        const isRange = prop('selectionMode') === 'range'
        const index = isRange ? context.get('activeIndex') : 0
        let value: (Date | undefined)[]
        let indexes: EndpointIndex[]
        if (event.type === 'VALUE.SET') {
          value = normalizeDates(event.value)
          indexes = isRange ? [0, 1] : [0]
        }
        else if (event.type === 'CELL.CLICK') {
          const date = startOfDay(event.value)
          value = isRange ? setRangeEndpoint(context.get('value'), index, date) : [date]
          indexes = [index]
        }
        else {
          return
        }
        context.set('value', value)
        scheduleInputSync(params, indexes)

        if (event.type === 'CELL.CLICK' && isRange) {
          context.set('hoveredValue', null)
        }
      },

      setHoveredDate({ context, event }) {
        context.set('hoveredValue', startOfDay(event.value))
      },
      clearHoveredDate({ context }) {
        context.set('hoveredValue', null)
      },

      syncInputElement(params) {
        scheduleInputSync(params)
      },
      // Opening uses the adjusted draft even when the raw input is invalid.
      setFocusedValueOnOpen({ context, prop, scope, event }) {
        const value = context.get('value')
        const index = event.type === 'TRIGGER.CLICK' || event.type === 'OPEN' ? event.index ?? 0 : 0
        context.set('activeIndex', index)
        const externalEl = dom.getInputEl(scope, index)
        const inputDate = externalEl
          ? parseDateString(externalEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)
          : undefined
        const isRange = prop('selectionMode') === 'range'
        let fallback: Date | undefined
        if (isRange)
          fallback = value[index] ?? value[1 - index]
        else if (!externalEl)
          fallback = value[index]
        const candidate = inputDate ?? fallback ?? prop('defaultDate') ?? startOfToday()
        const bounds = getEffectiveDateBounds(isRange, index, value, prop('min'), prop('max'))
        context.set('focusedValue', clamp(candidate, bounds))
      },

      commitInputValue(params) {
        const { context, prop, event } = params
        const index = event.index ?? 0
        const nextTexts = [...context.get('inputValues')]
        nextTexts[index] = event.value
        context.set('inputValues', nextTexts)
        const current = context.get('value')
        const isRange = prop('selectionMode') === 'range'
        const bounds = getEffectiveDateBounds(isRange, index, current, prop('min'), prop('max'))
        const parsed = parseInputValue(event.value, bounds.start, bounds.end)
        const next = isRange
          ? setRangeEndpoint(current, index, parsed)
          : parsed ? [parsed] : []
        context.set('value', next)
      },

      reconcileCalendar(params) {
        const { context, prop, scope, event, action } = params
        const inputDate = parseDateString(event.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)
        if (!inputDate)
          return
        context.set('hoveredValue', null)
        const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', event.index, context.get('value'), prop('min'), prop('max'))
        context.set('focusedValue', clamp(inputDate, bounds))
        context.set('view', 'day')
        context.set('isOpeningRender', false)
        // Rebuilding the grid can blur its focused cell; restore calendar focus.
        const contentEl = dom.getContentEl(scope)
        const active = scope.getActiveElement()
        if (contentEl && active && contentEl.contains(active)) {
          action(['focusActiveCell'])
        }
      },

      resetView({ context }) {
        context.set('view', 'day')
      },

      markOpeningRender({ context }) {
        context.set('isOpeningRender', true)
      },

      applyNav({ context, computed, event }) {
        const bounds = computed('activeBounds')
        const step = event.type === 'GOTO.PREV' ? -1 : 1
        const anchor = context.get('focusedValue')
        const target = event.view === 'year'
          ? setYear(anchor, Math.max(0, context.get('focusedYear') + step * YEAR_CHUNK))
          : event.unit === 'year' ? addYears(anchor, step) : addMonths(anchor, step)
        const capped = clamp(target, bounds)
        if (event.view === 'year')
          context.set('focusedYear', capped.getFullYear())
        else
          context.set('focusedValue', capped)
        context.set('isOpeningRender', false)
      },

      focusNavTrigger({ scope, event, refs }) {
        const direction = event.type === 'GOTO.PREV' ? 'prev' : 'next'
        scheduleFocusFrame({ scope, refs }, () => {
          const btn = dom.getNavTriggerEl(scope, direction, event.view, event.unit)
          if (btn && !btn.disabled)
            btn.focus()
          else (event.view === 'year' ? dom.getViewEl(scope, 'year') : dom.getViewControlEl(scope))?.focus()
        })
      },

      setView({ context, event }) {
        context.set('hoveredValue', null)
        context.set('view', event.view)
        context.set('isOpeningRender', false)
        const anchor = context.get('focusedValue')
        context.set('focusedYear', anchor.getFullYear())
        context.set('focusedMonth', anchor.getMonth())
      },

      setFocusedValueForView({ context, computed, event }) {
        const bounds = computed('activeBounds')
        context.set('focusedValue', clamp(event.value, bounds))
        context.set('isOpeningRender', false)
        context.set('hoveredValue', null)
      },

      keyboardNav({ context, computed, event, action }) {
        const bounds = computed('activeBounds')
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        if (view === 'month') {
          const currentMonth = context.get('focusedMonth')
          const currentDate = setMonth(focusedValue, currentMonth)
          const target = getMonthYearKeyTarget(event.type, currentMonth, 'month')
          const nextMonth = Math.max(0, Math.min(11, target))
          const capped = clamp(setMonth(focusedValue, nextMonth), bounds)
          if (isSameMonth(currentDate, capped))
            return
          context.set('focusedMonth', capped.getMonth())
        }
        else if (view === 'year') {
          const currentYear = context.get('focusedYear')
          const currentDate = setYear(focusedValue, currentYear)
          const target = getMonthYearKeyTarget(event.type, currentYear, 'year')
          const nextYear = Math.max(0, target)
          const capped = clamp(setYear(focusedValue, nextYear), bounds)
          if (isSameYear(currentDate, capped))
            return
          context.set('focusedYear', capped.getFullYear())
        }
        else {
          const capped = clamp(getDayKeyTarget(event.type, focusedValue, event.larger), bounds)
          if (isSameDay(focusedValue, capped))
            return
          context.set('focusedValue', capped)
        }
        context.set('isOpeningRender', false)
        context.set('hoveredValue', null)
        action(['focusActiveCell'])
      },

      invokeOnOpenChange({ prop, state }) {
        prop('onOpenChange')?.({ open: state.matches('open') })
      },

      focusInputElement({ scope, refs, context, prop }) {
        scheduleFocusFrame({ scope, refs }, () => {
          const index = prop('selectionMode') === 'range' ? context.get('activeIndex') : 0
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
        const { scope, context, prop, refs } = params
        const count = prop('selectionMode') === 'range' ? 2 : 1
        for (let index = 0; index < count; index++) {
          const input = dom.getInputEl(scope, index)
          if (!input)
            continue
          if (context.get('value')[index]) {
            writeInput(params, index, true)
            continue
          }
          if (input.value)
            input.value = ''
          rememberInputText(params, index, '')
        }
        return () => refs.get('inputSyncCleanup')?.()
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
