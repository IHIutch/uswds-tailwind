import type { Params } from '@zag-js/core'
import type { DatePickerSchema, DateValue } from './date-picker.types'
import * as dom from './date-picker.dom'
import { DEFAULT_EXTERNAL_DATE_FORMAT, formatDate, getEffectiveDateBounds } from './date-picker.utils'

export function createDatePickerInputs({ scope, context, prop }: Pick<Params<DatePickerSchema>, 'scope' | 'context' | 'prop'>) {
  const win = scope.getWin()
  const pending = new Set<number>()
  let acceptedFrame: number | undefined

  function rememberVisibleInput(index: number, text: string) {
    const inputValues = context.get('inputValues')
    if (inputValues[index] === text)
      return
    const next = [...inputValues]
    next[index] = text
    context.set('inputValues', next)
  }

  function acceptedText(date: DateValue | undefined) {
    return {
      internal: date ? formatDate(date) : '',
      external: date ? formatDate(date, DEFAULT_EXTERNAL_DATE_FORMAT) : '',
    }
  }

  // Explicit commits always emit hidden then visible changes. Passive updates
  // write only changed values and preserve the external input's active draft.
  function writeInput(index: number, date: DateValue | undefined, explicit = false) {
    const text = acceptedText(date)
    const min = prop('min')
    const max = prop('max')
    const hidden = dom.getHiddenInputEl(scope, index)
    if (hidden && (explicit || hidden.value !== text.internal))
      dom.changeElementValue(hidden, text.internal)
    const external = dom.getExternalInputEl(scope, index)
    if (external && (explicit || !scope.isActiveElement(external))) {
      if (explicit || external.value !== text.external) {
        dom.changeElementValue(external, text.external)
        dom.applyDateInputValidity(external, text.external, min, max)
      }
      rememberVisibleInput(index, text.external)
    }
  }

  return {
    initialize() {
      dom.forEachInitialInput(scope, prop('selectionMode') === 'range' ? 2 : 1, (element, index, internal) => {
        const date = context.get('value')[index]
        const text = acceptedText(date)[internal ? 'internal' : 'external']
        if (date)
          dom.changeElementValue(element, text)
        else if (element.value)
          element.value = ''
        if (!internal)
          rememberVisibleInput(index, text)
        if (date && !internal) {
          const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
          dom.applyDateInputValidity(element, text, bounds.min, bounds.max)
        }
      })
    },
    commit(indexes: number[]) {
      const commit = () => indexes.forEach(index => writeInput(index, context.get('value')[index], true))
      // Uncontrolled actions preserve intermediate values; controlled actions wait for acceptance.
      if (prop('value') === undefined) {
        commit()
        return
      }
      const frame = win.requestAnimationFrame(() => {
        if (pending.delete(frame))
          commit()
      })
      pending.add(frame)
    },
    reconcile() {
      if (acceptedFrame !== undefined)
        win.cancelAnimationFrame(acceptedFrame)
      // Do not cancel explicit transactions queued before this accepted update.
      const frame = win.requestAnimationFrame(() => {
        if (acceptedFrame !== frame)
          return
        acceptedFrame = undefined
        const value = context.get('value')
        writeInput(0, value[0])
        writeInput(1, value[1])
      })
      acceptedFrame = frame
    },
    mirrorTyped(index: number, proposed: DateValue | undefined) {
      const acceptedInternal = acceptedText(context.get('value')[index]).internal
      if (acceptedInternal !== acceptedText(proposed).internal)
        return
      const hidden = dom.getHiddenInputEl(scope, index)
      if (hidden && hidden.value !== acceptedInternal)
        dom.changeElementValue(hidden, acceptedInternal)
    },
    dispose() {
      pending.forEach(frame => win.cancelAnimationFrame(frame))
      pending.clear()
      if (acceptedFrame !== undefined)
        win.cancelAnimationFrame(acceptedFrame)
      acceptedFrame = undefined
    },
  }
}

export type DatePickerInputs = ReturnType<typeof createDatePickerInputs>
