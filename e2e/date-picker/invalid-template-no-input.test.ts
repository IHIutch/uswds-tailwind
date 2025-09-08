import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker without input', () => {
  const invalidTemplateNoInput = `
    <div>
      <div data-part="date-picker-root"></div>
    </div>
  `

  beforeEach(() => {
    document.body.innerHTML = invalidTemplateNoInput
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should throw an error when date picker is activated without an input', () => {
    expect(() => datePickerInit()).toThrow('Expected input element to be defined')
  })
})