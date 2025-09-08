import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

describe('date picker with invalid templates', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('date picker without input', () => {
    const invalidTemplateNoInput = `
      <div>
        <div data-part="date-picker-root"></div>
      </div>
    `

    beforeEach(() => {
      document.body.innerHTML = invalidTemplateNoInput
    })

    it('should throw an error when date picker is activated without an input', () => {
      expect(() => datePickerInit()).toThrow('Expected input element to be defined')
    })
  })

  describe('date picker without wrapper', () => {
    const invalidTemplateNoWrapper = `
      <div>
        <button type="button" data-part="date-picker-trigger"></button>
      </div>
    `

    beforeEach(() => {
      document.body.innerHTML = invalidTemplateNoWrapper
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

  describe('date picker without required elements', () => {
    const minimalTemplate = `
      <div>
        <div data-part="date-picker-root">
          <!-- Missing input -->
          <button data-part="date-picker-trigger" type="button"></button>
        </div>
      </div>
    `

    beforeEach(() => {
      document.body.innerHTML = minimalTemplate
    })

    it('should throw an error when required input element is missing', () => {
      expect(() => datePickerInit()).toThrow('Expected input element to be defined')
    })
  })

  describe('date picker without trigger', () => {
    const templateNoTrigger = `
      <div>
        <div data-part="date-picker-root">
          <input data-part="date-picker-input" type="text">
          <!-- Missing trigger button -->
        </div>
      </div>
    `

    beforeEach(() => {
      document.body.innerHTML = templateNoTrigger
    })

    it('should throw an error when required trigger element is missing', () => {
      expect(() => datePickerInit()).toThrow('Expected trigger element to be defined')
    })
  })

  describe('date picker without calendar', () => {
    const templateNoCalendar = `
      <div>
        <div data-part="date-picker-root">
          <input data-part="date-picker-input" type="text">
          <button data-part="date-picker-trigger" type="button"></button>
          <!-- Missing calendar content -->
        </div>
      </div>
    `

    beforeEach(() => {
      document.body.innerHTML = templateNoCalendar
    })

    it('should throw an error when required calendar element is missing', () => {
      expect(() => datePickerInit()).toThrow('Expected calendar element to be defined')
    })
  })
})