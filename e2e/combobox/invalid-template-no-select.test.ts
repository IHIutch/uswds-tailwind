import { expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'

const template = `<div data-part="combobox-root"></div>`

it('should throw an error when a combo box component is created with no select element', async () => {
  document.body.innerHTML = template
  expect(() => comboboxInit()).toThrow()
})
