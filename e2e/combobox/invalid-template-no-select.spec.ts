import { describe, expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'

const TEMPLATE = `<div data-part="combobox-root"></div>`

describe('character count component without message', () => {
  const { body } = document

  it('should throw an error when a combo box component is created with no select element', async () => {
    body.innerHTML = TEMPLATE
    expect(() => comboboxInit()).toThrow()
  })
})
