import type { Params } from '@zag-js/core'
import type { DatePickerSchema, DateValue, DateView, EndpointIndex } from './date-picker.types'
import { createMachine } from '@zag-js/core'
import { trackDismissableElement } from '@zag-js/dismissable'
import * as dom from './date-picker.dom'
import { createDatePickerInputs } from './date-picker.inputs'
import {
  addDays,
  addMonths,
  addYears,
  DEFAULT_EXTERNAL_DATE_FORMAT,
  endOfWeek,
  getEffectiveDateBounds,
  getNavigationAvailability,
  isDatesMonthOutsideMinOrMax,
  isDatesYearOutsideMinOrMax,
  isDateWithinMinAndMax,
  isEndpointIndex,
  isSameDay,
  isSameMonth,
  isSameYear,
  keepDateBetweenMinAndMax,
  normalizeDate,
  parseDateString,
  parseInputValue,
  serializeDates,
  setDate,
  setMonth,
  setRangeEndpoint,
  setYear,
  startOfWeek,
  today,
  YEAR_CHUNK,
} from './date-picker.utils'

function isDateEqual(a: DateValue | null | undefined, b: DateValue | null | undefined): boolean {
  if (a == null || b == null)
    return a === b
  return isSameDay(a, b)
}
function isDateArrayEqual(a: (DateValue | undefined)[], b: (DateValue | undefined)[] | undefined): boolean {
  if (b === undefined || a.length !== b.length)
    return false
  return a.every((date, index) => isDateEqual(date, b[index]))
}

function emitValueChange({ context, prop }: Pick<Params<DatePickerSchema>, 'context' | 'prop'>, value: (DateValue | undefined)[]): void {
  prop('onValueChange')?.({
    value,
    valueAsString: serializeDates(value),
    view: context.get('view'),
  })
}

// Only the latest focus request may run, after the consumer renders.
function scheduleFocusFrame({ scope, refs }: Pick<Params<DatePickerSchema>, 'scope' | 'refs'>, callback: () => void): void {
  refs.get('focusRafCleanup')?.()
  const win = scope.getWin()
  let id = 0
  const cleanup = () => {
    win.cancelAnimationFrame(id)
    if (refs.get('focusRafCleanup') === cleanup)
      refs.set('focusRafCleanup', null)
  }
  id = win.requestAnimationFrame(() => {
    cleanup()
    callback()
  })
  refs.set('focusRafCleanup', cleanup)
}

function dayKeyTarget(type: string, d: DateValue, larger = false): DateValue {
  switch (type) {
    case 'TABLE.ARROW_UP': return addDays(d, -7)
    case 'TABLE.ARROW_DOWN': return addDays(d, 7)
    case 'TABLE.ARROW_LEFT': return addDays(d, -1)
    case 'TABLE.ARROW_RIGHT': return addDays(d, 1)
    case 'TABLE.HOME': return startOfWeek(d)
    case 'TABLE.END': return endOfWeek(d)
    case 'TABLE.PAGE_UP': return larger ? addYears(d, -1) : addMonths(d, -1)
    case 'TABLE.PAGE_DOWN': return larger ? addYears(d, 1) : addMonths(d, 1)
    default: return d
  }
}
function selectionKeyTarget(type: string, value: number, view: 'month' | 'year'): number {
  switch (type) {
    case 'TABLE.ARROW_UP': return value - 3
    case 'TABLE.ARROW_DOWN': return value + 3
    case 'TABLE.ARROW_LEFT': return value - 1
    case 'TABLE.ARROW_RIGHT': return value + 1
    case 'TABLE.HOME': return value - (value % 3)
    case 'TABLE.END': return value + 2 - (value % 3)
    case 'TABLE.PAGE_UP': return view === 'month' ? 0 : value - YEAR_CHUNK
    case 'TABLE.PAGE_DOWN': return view === 'month' ? 11 : value + YEAR_CHUNK
    default: return value
  }
}
function reconcileVisibleCalendar(params: Params<DatePickerSchema>, inputValue: string, index: EndpointIndex) {
  const { context, prop, scope, action } = params
  const inputDate = parseDateString(inputValue, DEFAULT_EXTERNAL_DATE_FORMAT, true)
  if (!inputDate)
    return
  // USWDS replaces the grid on refresh, discarding the previous hover preview.
  context.set('hoveredValue', null)
  const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
  context.set('focusedValue', keepDateBetweenMinAndMax(inputDate, bounds.min, bounds.max))
  // USWDS returns to the day grid when typed input refreshes the calendar.
  context.set('view', 'day')
  context.set('isOpeningRender', false)
  // Re-centering can blur a newly disabled cell. Restore calendar focus
  // without stealing it from the external input.
  const contentEl = dom.getContentEl(scope)
  const active = scope.getActiveElement()
  if (contentEl && active && contentEl.contains(active)) {
    action(['focusActiveCell'])
  }
}

export const machine = createMachine<DatePickerSchema>({
  props({ props }) {
    const min = props.min ? normalizeDate(props.min) : setDate(0, 0, 1)
    const max = props.max ? normalizeDate(props.max) : undefined
    // USWDS checks conflicting bounds only when both are explicitly supplied.
    if (props.min && props.max && max && min.getTime() > max.getTime())
      throw new Error('Minimum date cannot be after maximum date')
    return {
      ...props,
      selectionMode: props.selectionMode || 'single',
      min,
      max,
      defaultDate: props.defaultDate ? normalizeDate(props.defaultDate) : undefined,
      rangeAnchor: props.rangeAnchor ? normalizeDate(props.rangeAnchor) : undefined,
    }
  },

  initialState() {
    return 'idle'
  },

  exit: ['cancelFocusRaf', 'cancelNativeSyncRaf'],

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
      return getNavigationAvailability(context.get('focusedValue'), context.get('focusedYear'), bounds.min, bounds.max)
    },
  },

  context({ prop, bindable }) {
    return {
      // Array.from preserves sparse range slots as explicit empty endpoints.
      value: bindable<(DateValue | undefined)[]>(() => {
        const controlledValue = prop('value')
        return {
          defaultValue: Array.from(prop('defaultValue') ?? [], d => (d ? normalizeDate(d) : undefined)),
          value: controlledValue ? Array.from(controlledValue, d => (d ? normalizeDate(d) : undefined)) : undefined,
          isEqual: isDateArrayEqual,
          // Input commits read the new selection in the same task.
          sync: true,
        }
      }),
      focusedValue: bindable<DateValue>(() => ({
        defaultValue: today(),
        isEqual: isDateEqual,
      })),
      view: bindable<DateView>(() => ({
        defaultValue: 'day',
      })),
      hoveredValue: bindable<DateValue | null>(() => ({
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

  effects: ['bridgeMountedInputs'],

  watch({ track, prop, action }) {
    track([() => prop('value') === undefined ? undefined : serializeDates(prop('value')!).join(',')], () => {
      action(['syncInputElement'])
    })
  },

  on: {
    'VALUE.SET': {
      actions: ['setDateValue'],
    },
    'INPUT.CHANGE': { actions: ['commitInputValue', 'reconcileCalendar'] },
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
        // Escape restores input focus even when the calendar is already closed.
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
        // Outside interaction closes without restoring input focus.
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
      isDifferentActiveIndex: ({ context, prop, event }) =>
        prop('selectionMode') === 'range'
        && event.index !== context.get('activeIndex'),
      isSelectableDate: ({ computed, event }) => {
        const bounds = computed('activeBounds')
        return isDateWithinMinAndMax(event.value, bounds.min, bounds.max)
      },
      canGoPrev: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkPrev : computed('navigation').canGoPrev,
      canGoNext: ({ computed, event }) => event.view === 'year' ? computed('navigation').canChunkNext : computed('navigation').canGoNext,
      isSelectableViewCell: ({ context, computed, event }) => {
        const view = context.get('view')
        if (view === 'day')
          return false
        const bounds = computed('activeBounds')
        if (view === 'month')
          return !isDatesMonthOutsideMinOrMax(event.value, bounds.min, bounds.max)
        return !isDatesYearOutsideMinOrMax(event.value, bounds.min, bounds.max)
      },
      isChoosingRangeEnd: ({ context, prop }) =>
        (prop('selectionMode') === 'range' && context.get('activeIndex') === 1 && Boolean(context.get('value')[0]) && !context.get('value')[1])
        || (prop('selectionMode') === 'single' && Boolean(prop('rangeAnchor')) && context.get('value').length === 0),
    },

    actions: {
      // Callbacks report proposals; native input writes read accepted values.
      setDateValue(params) {
        const { context, prop, event } = params
        const isRange = prop('selectionMode') === 'range'
        const index = isRange ? context.get('activeIndex') : 0
        let value: (DateValue | undefined)[]
        if (event.type === 'VALUE.SET') {
          value = Array.from(event.value, date => date ? normalizeDate(date) : undefined)
        }
        else if (event.type === 'CELL.CLICK') {
          const date = normalizeDate(event.value)
          value = isRange ? setRangeEndpoint(context.get('value'), index, date) : [date]
        }
        else {
          return
        }
        context.set('value', value)
        emitValueChange(params, value)
        params.refs.get('inputs')?.commit(event.type === 'VALUE.SET' ? prop('selectionMode') === 'range' ? [0, 1] : [0] : [index])
        if (event.type === 'CELL.CLICK' && isRange)
          context.set('hoveredValue', null)
      },

      setHoveredDate({ context, event }) {
        context.set('hoveredValue', normalizeDate(event.value))
      },
      clearHoveredDate({ context }) {
        context.set('hoveredValue', null)
      },

      syncInputElement({ refs }) {
        refs.get('inputs')?.reconcile()
      },
      // Open around the adjusted external draft, even when validation rejects it.
      setFocusedValueOnOpen({ context, prop, scope, event }) {
        const value = context.get('value')
        const index = (event.type === 'TRIGGER.CLICK' || event.type === 'OPEN') && isEndpointIndex(event.index) ? event.index : 0
        context.set('activeIndex', index)
        const externalEl = dom.getInputEl(scope, index)
        const inputDate = externalEl
          ? parseDateString(externalEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true)
          : undefined
        const isRange = prop('selectionMode') === 'range'
        const fallback = isRange ? value[index] ?? value[1 - index] : externalEl ? undefined : value[index]
        const candidate = inputDate ?? fallback ?? prop('defaultDate') ?? today()
        const bounds = getEffectiveDateBounds(isRange, index, value, prop('min'), prop('max'))
        context.set('focusedValue', keepDateBetweenMinAndMax(candidate, bounds.min, bounds.max))
      },

      // Typing preserves the raw draft and updates only the typed endpoint.
      commitInputValue(params) {
        const { context, prop, event } = params
        const index = isEndpointIndex(event.index) ? event.index : 0
        const nextTexts = [...context.get('inputValues')]
        nextTexts[index] = event.value
        context.set('inputValues', nextTexts)
        const current = context.get('value')
        const isRange = prop('selectionMode') === 'range'
        const bounds = getEffectiveDateBounds(isRange, index, current, prop('min'), prop('max'))
        const parsed = parseInputValue(event.value, bounds.min, bounds.max)
        // Clearing the start must preserve a committed end as [undefined, end].
        const next = isRange
          ? setRangeEndpoint(current, index, parsed)
          : parsed ? [parsed] : []
        context.set('value', next)
        emitValueChange(params, next)
      },

      reconcileCalendar(params) {
        reconcileVisibleCalendar(params, params.event.value, params.event.index)
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
        const capped = keepDateBetweenMinAndMax(target, bounds.min, bounds.max)
        if (event.view === 'year')
          context.set('focusedYear', capped.getFullYear())
        else
          context.set('focusedValue', capped)
        context.set('isOpeningRender', false)
      },

      // A newly disabled navigation button needs a focus fallback.
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
        // A view change discards the day grid's hover preview.
        context.set('hoveredValue', null)
        context.set('view', event.view)
        context.set('isOpeningRender', false)
        const anchor = context.get('focusedValue')
        context.set('focusedYear', anchor.getFullYear())
        context.set('focusedMonth', anchor.getMonth())
      },

      setFocusedValueForView({ context, computed, event }) {
        const bounds = computed('activeBounds')
        context.set('focusedValue', keepDateBetweenMinAndMax(event.value, bounds.min, bounds.max))
        context.set('isOpeningRender', false)
        context.set('hoveredValue', null)
      },

      // Boundary no-ops preserve hover, status and focus.
      keyboardNav({ context, computed, event, action }) {
        const bounds = computed('activeBounds')
        const view = context.get('view')
        const focusedValue = context.get('focusedValue')
        let moved = false
        if (view !== 'day') {
          const key = view === 'month' ? 'focusedMonth' : 'focusedYear'
          const set = view === 'month' ? setMonth : setYear
          const isEqual = view === 'month' ? isSameMonth : isSameYear
          const get = (date: DateValue) => view === 'month' ? date.getMonth() : date.getFullYear()
          const currentDate = set(focusedValue, context.get(key))
          const target = selectionKeyTarget(event.type, context.get(key), view)
          const adjusted = Math.max(0, view === 'month' ? Math.min(11, target) : target)
          const capped = keepDateBetweenMinAndMax(set(focusedValue, adjusted), bounds.min, bounds.max)
          if (!isEqual(currentDate, capped)) {
            context.set(key, get(capped))
            moved = true
          }
        }
        else {
          const capped = keepDateBetweenMinAndMax(dayKeyTarget(event.type, focusedValue, event.larger), bounds.min, bounds.max)
          if (!isSameDay(focusedValue, capped)) {
            context.set('focusedValue', capped)
            moved = true
          }
        }
        if (moved) {
          context.set('isOpeningRender', false)
          context.set('hoveredValue', null)
          action(['focusActiveCell'])
        }
      },

      // Transition callbacks run after the new state commits.
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
      cancelNativeSyncRaf({ refs }) {
        refs.get('inputs')?.dispose()
      },
    },

    effects: {
      bridgeMountedInputs({ scope, context, prop, refs }) {
        const inputs = createDatePickerInputs({ scope, context, prop })
        refs.set('inputs', inputs)
        inputs.initialize()
      },
      trackDismissableElement({ scope, send }) {
        return trackDismissableElement(() => dom.getContentEl(scope), {
          type: 'popover',
          // Register authored content immediately so opening a sibling picker closes this one.
          defer: !dom.getContentEl(scope),
          // Exclude the input and trigger as well as the calendar from outside dismissal.
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
