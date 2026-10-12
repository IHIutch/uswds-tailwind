import { expect, it } from 'vitest'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'

const template = `
  <div>
    <div data-scope="date-range-picker" data-part="root">
      <!-- Missing required input elements -->
    </div>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/test/invalid-template-no-input.spec.js#L25
it('should throw an error when initialized without required input elements', { tags: ['legacy'] }, () => {
  document.body.innerHTML = template
  expect(() => dateRangePickerInit()).toThrow('Expected start input element to be defined')
})
