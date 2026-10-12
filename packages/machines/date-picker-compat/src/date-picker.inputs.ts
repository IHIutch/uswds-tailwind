import type { Params } from '@zag-js/core'
import type { DatePickerSchema } from './date-picker.types'
import * as dom from './date-picker.dom'
import { getEffectiveDateBounds } from './date-picker.utils'
import { DEFAULT_EXTERNAL_DATE_FORMAT, formatDate } from './date-utils'

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

  function acceptedText(date: Date | undefined) {
    return date ? formatDate(date, DEFAULT_EXTERNAL_DATE_FORMAT) : ''
  }

  // Explicit commits emit change even when the value is unchanged.
  function writeInput(index: number, date: Date | undefined, explicit = false) {
    const text = acceptedText(date)
    const input = dom.getInputEl(scope, index)
    if (!input)
      return
    if (explicit || !scope.isActiveElement(input)) {
      if (explicit || input.value !== text)
        dom.changeElementValue(input, text)
      rememberVisibleInput(index, text)
    }
    const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
    dom.applyDateInputValidity(input, input.value, bounds.start, bounds.end)
  }

  return {
    initialize() {
      const count = prop('selectionMode') === 'range' ? 2 : 1
      for (let index = 0; index < count; index++) {
        const input = dom.getInputEl(scope, index)
        if (!input)
          continue
        const date = context.get('value')[index]
        const text = acceptedText(date)
        if (date)
          dom.changeElementValue(input, text)
        else if (input.value)
          input.value = ''
        rememberVisibleInput(index, text)
        if (date) {
          const bounds = getEffectiveDateBounds(prop('selectionMode') === 'range', index, context.get('value'), prop('min'), prop('max'))
          dom.applyDateInputValidity(input, text, bounds.start, bounds.end)
        }
      }
    },
    commit(indexes: number[]) {
      const commit = () => indexes.forEach(index => writeInput(index, context.get('value')[index], true))
      // Controlled commits wait a frame for the consumer to accept the proposal.
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
      // Keep pending explicit commits when replacing a reconciliation frame.
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
