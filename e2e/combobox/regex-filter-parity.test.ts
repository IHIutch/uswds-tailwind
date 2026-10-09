import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

function template(filter: string, labels: string[], extraAttributes = '') {
  return `<div data-scope="combobox" data-part="root" id="regex" data-filter="${filter}" ${extraAttributes}>
    <label data-part="label">Choice</label>
    <select data-part="hidden-select"><option value="">Choose</option>${labels.map((label, index) => `<option value="${index}">${label}</option>`).join('')}</select>
    <input data-part="input"><ul data-part="list"></ul>
  </div>`
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385 (anchors the configured filter to the whole option label)
it('shows only labels matching a static regex template', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('something', ['something', 'something else']))
  await userEvent.fill(component.elements.getInputEl(), 'ignored query')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['something'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385 (trims placeholder names and inserts escaped query text)
it('substitutes the query into a template with whitespace around the placeholder name', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('something{{ query }}', ['something else', 'something']))
  await userEvent.fill(component.elements.getInputEl(), ' else')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['something else'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385 (uses a named regex's first capture from the query)
it('matches labels using a named capture extracted from the query', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('something{{ capture }}', ['somethingLS', 'something', 'something Else'], 'data-capture="([LS]+)"'))
  await userEvent.fill(component.elements.getInputEl(), ' Else')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['somethingLS'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385 (preserves escaped braces as literal template text)
it('matches literal braces when they are escaped in the template', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('something\\{\\{else\\}\\}', ['something{{else}}', 'something else']))
  await userEvent.fill(component.elements.getInputEl(), ' else')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['something{{else}}'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L336-L385 (escapes regex characters in the input before substituting them)
it('matches typed regex operators literally instead of executing them', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('something {{query}}', ['something .* else', 'something ?? else']))
  await userEvent.fill(component.elements.getInputEl(), '.* else')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['something .* else'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L340-L353 ({{query}} always takes the typed text, even when the extras have a "query" key)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L382-L383 (the combo box dataset supplies the extras)
it('substitutes the typed text for {{query}} even when the root has a data-query attribute', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('regex', template('{{query}}.*', ['Apple', 'Apricot', 'Banana'], 'data-query="(z)"'))

  await userEvent.fill(page.getByRole('combobox', { name: 'Choice' }), 'ap')

  await expect.element(page.getByRole('option', { name: 'Apricot' })).toBeVisible()
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['Apple', 'Apricot'])
})
