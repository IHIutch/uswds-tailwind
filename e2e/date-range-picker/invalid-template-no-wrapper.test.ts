import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

describe('Date range picker with missing wrapper element', () => {
  let template: string

  const createInvalidTemplate = () => `
    <div>
      <!-- Inputs without proper date-range-picker-root wrapper -->
      <div class="usa-form-group">
        <input data-part="date-range-picker-start-input" id="start" type="text" />
      </div>
      <div class="usa-form-group">
        <input data-part="date-range-picker-end-input" id="end" type="text" />
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

  it('should not find any date range picker components without proper wrapper', () => {
    // Since there's no element with data-part="date-range-picker-root", 
    // dateRangePickerInit should not initialize any components and should not throw
    expect(() => dateRangePickerInit()).not.toThrow()
    
    // Verify no components were initialized by checking that the inputs don't have the enhanced attributes
    const startInput = document.querySelector('[data-part="date-range-picker-start-input"]') as HTMLInputElement
    const endInput = document.querySelector('[data-part="date-range-picker-end-input"]') as HTMLInputElement
    
    expect(startInput).toBeTruthy()
    expect(endInput).toBeTruthy()
    
    // These inputs should not have been enhanced with any special attributes
    expect(startInput.min).toBe('')
    expect(startInput.max).toBe('')
    expect(endInput.min).toBe('')
    expect(endInput.max).toBe('')
  })
})