import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker without wrapper', () => {
  const invalidTemplateNoWrapper = `
    <div>
      <button type="button" data-part="date-picker-trigger"></button>
    </div>
  `

  beforeEach(() => {
    document.body.innerHTML = invalidTemplateNoWrapper
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should not error when trigger exists without wrapper', () => {
    // In the new system, individual components don't initialize without a root wrapper
    // The datePickerInit function only looks for elements with data-part="date-picker-root"
    expect(() => datePickerInit()).not.toThrow()
    
    // Since there's no root element, no date picker should be initialized
    const rootEl = document.querySelector('[data-part="date-picker-root"]')
    expect(rootEl).toBeNull()
  })
})