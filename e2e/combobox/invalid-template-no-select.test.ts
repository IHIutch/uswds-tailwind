import { expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'

const template = `<div data-scope="combobox" data-part="root"></div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L165-L171
it('should throw an error when a combo box component is created with no select element', { tags: ['legacy'] }, async () => {
  document.body.innerHTML = template
  expect(() => comboboxInit()).toThrow()
})
