import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/test/input-mask.spec.js#L47-L53
it('formats a nine digit social security number to 999 99 9999', { tags: ['legacy'] }, async () => {
  await using component = createDisposableInputMask('ssn', INPUT_MASK('ssn', '___ __ ____'))
  await userEvent.type(component.elements.getInputEl(), '999999999')
  expect(component.elements.getContentEl().textContent).toBe('999 99 9999')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/test/input-mask-phone.spec.js#L47-L53
it('formats a US telephone number to 999-999-9999', { tags: ['legacy'] }, async () => {
  await using component = createDisposableInputMask('phone', INPUT_MASK('phone', '___-___-____'))
  await userEvent.type(component.elements.getInputEl(), '9999999999')
  expect(component.elements.getContentEl().textContent).toBe('999-999-9999')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/test/input-mask-zip-code.spec.js#L47-L53
it('formats a US ZIP code to 12345-6789', { tags: ['legacy'] }, async () => {
  await using component = createDisposableInputMask('zip', INPUT_MASK('zip', '_____-____'))
  await userEvent.type(component.elements.getInputEl(), '123456789')
  expect(component.elements.getContentEl().textContent).toBe('12345-6789')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/test/input-mask-alphanumeric.spec.js#L47-L53
it('formats an alphanumeric example to A1B 2C3', { tags: ['legacy'] }, async () => {
  await using component = createDisposableInputMask('alpha', INPUT_MASK('alpha', '___ ___', 'data-charset="A#A #A#"'))
  await userEvent.type(component.elements.getInputEl(), 'A1B2C3')
  expect(component.elements.getContentEl().textContent).toBe('A1B 2C3')
})
