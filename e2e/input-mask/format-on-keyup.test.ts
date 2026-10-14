import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { expectNever } from '../_utils'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L109-L115 (formats on keyup only)
it('formats text entered without a key press on the next keyup', { tags: ['parity'] }, async () => {
  await using component = createDisposableInputMask('date', INPUT_MASK('date', '__/__/____'))
  const { getInputEl, getContentEl } = component.elements
  await userEvent.fill(getInputEl(), '1234')
  await expectNever(() => expect(getInputEl().value).toBe('12/34'))
  await userEvent.keyboard('{Shift}')
  await expect.element(getInputEl()).toHaveValue('12/34')
  await expect.element(getContentEl()).toHaveTextContent('12/34/____')
})
