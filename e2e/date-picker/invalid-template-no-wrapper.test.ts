import { query } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'

const template = `
  <div>
    <button type="button" data-part="trigger"></button>
  </div>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2273-L2278 (initialization selects only date-picker roots)
it('should not error when trigger exists without wrapper', { tags: ['parity'] }, () => {
  document.body.innerHTML = template

  expect(() => datePickerInit()).not.toThrow()

  const rootEl = query(document, '[data-scope="date-picker"][data-part="root"]')
  expect(rootEl).toBeNull()

  document.body.innerHTML = ''
})
