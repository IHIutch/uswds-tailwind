import { expect, it } from 'vitest'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

it('formats an authored initial value for the field and overlay', { tags: ['new'] }, async () => {
  await using fixture = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____', 'value="1234"'))
  expect(fixture.elements.getInputEl().value).toBe('12/34')
  expect(fixture.elements.getContentEl().textContent).toBe('12/34/____')
})
