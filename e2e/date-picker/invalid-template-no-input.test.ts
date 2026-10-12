import { expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const template = `
  <div>
    <div data-scope="date-picker" data-part="root"></div>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/invalid-template-no-input.spec.js#L29
it('should throw an error when date picker is activated without an input', { tags: ['legacy'] }, () => {
  document.body.innerHTML = template
  expect(() => datePickerInit()).toThrow('Expected input element to be defined')
})
