import { expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const template = `
  <div data-scope="date-picker" data-part="root">
    <input data-part="input" type="text">
    <button data-part="trigger" type="button"></button>
    <div data-part="content">
      <div data-part="view" data-view="day"></div>
      <div data-part="view" data-view="month"></div>
      <div data-part="view" data-view="year"></div>
    </div>
  </div>
`

// Required headless markup is a port-specific authoring contract.
it.each([
  { selector: '[data-part="trigger"]', message: 'Expected trigger element to be defined' },
  { selector: '[data-part="content"]', message: 'Expected calendar element to be defined' },
  { selector: '[data-view="day"]', message: 'Expected day view element to be defined' },
  { selector: '[data-view="month"]', message: 'Expected month view element to be defined' },
  { selector: '[data-view="year"]', message: 'Expected year view element to be defined' },
])('reports missing $selector with a required-markup error', { tags: ['new'] }, ({ selector, message }) => {
  document.body.innerHTML = template
  document.querySelector(selector)!.remove()
  expect(() => datePickerInit()).toThrow(message)
})
