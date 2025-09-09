import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

describe('Date range picker without inputs', () => {
  let template: string

  const createInvalidTemplate = () => `
    <div>
      <div data-part="date-range-picker-root">
        <!-- Missing required input elements -->
      </div>
    </div>
  `

  beforeEach(() => {
    template = createInvalidTemplate()
    document.body.innerHTML = template
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should throw an error when initialized without required input elements', () => {
    // The dateRangePickerInit function should throw an error when the required input elements are missing
    expect(() => dateRangePickerInit()).toThrow('Expected start input element to be defined')
  })
})