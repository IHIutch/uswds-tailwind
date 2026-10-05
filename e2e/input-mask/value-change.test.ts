import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableInputMask, INPUT_MASK } from './_utils.js'

function render(mask: string, charset?: string) {
  const attrs = charset ? `data-charset="${charset}"` : ''
  return createDisposableInputMask('test', `<form>${INPUT_MASK('test', mask, attrs)}</form>`)
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L16-L34
it('renders the mask, maxlength, and aria-hidden overlay', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const { getRootEl, getInputEl, getContentEl } = component.elements
  expect(getInputEl().value).toBe('')
  expect(getInputEl().getAttribute('maxlength')).toBe('10')
  expect(getInputEl().getAttribute('data-placeholder')).toBe('__/__/____')
  expect(getInputEl().hasAttribute('placeholder')).toBe(false)
  expect(getRootEl().getAttribute('data-mask')).toBe('__/__/____')
  expect(getContentEl().textContent).toBe('__/__/____')
  expect(getContentEl().getAttribute('aria-hidden')).toBe('true')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L50-L95
it.each([
  { name: 'stripped letters', mask: '__/__/____', text: '12ab34', expected: '12/34' },
  { name: 'excess digits', mask: '__/__/____', text: '123456789', expected: '12/34/5678' },
  { name: 'valid charset slots', mask: 'AAA999', charset: 'AAA999', text: 'ABC123', expected: 'ABC123' },
  { name: 'digit in a letter slot', mask: 'AAA999', charset: 'AAA999', text: 'A1', expected: 'A' },
  { name: 'letter in a number slot', mask: 'AAA999', charset: 'AAA999', text: 'ABCD', expected: 'ABC' },
  { name: 'short charset pattern', mask: '##-##', charset: '##', text: '12', expected: '12' },
  { name: 'literal A without charset', mask: 'AA-##', text: '12', expected: 'AA-12' },
  { name: 'underscore in a numeric charset slot', mask: '##', charset: '##', text: '1_', expected: '1' },
])('matches USWDS for $name', { tags: ['parity'] }, async ({ mask, text, expected, charset }) => {
  await using component = render(mask, charset)
  await userEvent.type(component.elements.getInputEl(), text)
  expect(component.elements.getInputEl().value).toBe(expected)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L68-L92
it('inserts a separator only when the next digit is entered', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const { getInputEl, getContentEl } = component.elements
  await userEvent.type(getInputEl(), '12')
  expect(getInputEl().value).toBe('12')
  await userEvent.type(getInputEl(), '3')
  expect(getInputEl().value).toBe('12/3')
  expect(getContentEl().textContent).toBe('12/3_/____')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L98-L113
it('removes the separator when deleting the following digit', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const { getInputEl, getContentEl } = component.elements
  await userEvent.type(getInputEl(), '123')
  await userEvent.type(getInputEl(), '{Backspace}')
  expect(getInputEl().value).toBe('12')
  expect(getContentEl().textContent).toBe('12/__/____')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L98-L113
it('formats pasted text and submits the result', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const input = component.elements.getInputEl()
  const donor = document.createElement('input')
  document.body.append(donor)
  await userEvent.type(donor, '12ab34')
  donor.select()
  await userEvent.copy()
  donor.remove()
  input.focus()
  await userEvent.paste()
  expect(input.value).toBe('12/34')
  expect(new FormData(input.form!).get(input.name)).toBe('12/34')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L98-L113
it('a no-op keyup leaves the formatted value and overlay unchanged', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const { getInputEl, getContentEl } = component.elements
  await userEvent.type(getInputEl(), '123')
  const before = [getInputEl().value, getContentEl().textContent]
  await userEvent.keyboard('{ArrowRight}')
  expect(before).toEqual(['12/3', '12/3_/____'])
  expect([getInputEl().value, getContentEl().textContent]).toEqual(before)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js#L98-L106
it('a changed value on keyup moves the caret to the end', { tags: ['parity'] }, async () => {
  await using component = render('__/__/____')
  const input = component.elements.getInputEl()
  await userEvent.type(input, '123')
  input.setSelectionRange(1, 1)
  await userEvent.type(input, '9')
  expect(input.value).toBe('19/23')
  expect(input.selectionStart).toBe(input.value.length)
})
