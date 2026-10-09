import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option><option value="apple">Apple</option>
  </select>
  <input data-part="input">
  <button data-part="trigger" type="button">Toggle</button>
  <ul data-part="list"></ul>
</div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L171-L239 (keeps the label association and transfers the select's naming attributes to the input)
it('uses the visible label as the combobox name and focuses the input from its label', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const input = component.elements.getInputEl()

  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toBeVisible()
  await userEvent.click(page.getByText('Fruit', { exact: true }).element())
  expect(document.activeElement).toBe(input)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L214-L245 (copies both authored accessible-name attributes from the select to the input)
it('uses authored aria-labelledby ahead of aria-label and tracks referenced text changes', { tags: ['parity'] }, async () => {
  const namedTemplate = `<span id="season">Seasonal</span><span id="kind">fruit choices</span>${template}`
    .replace('name="fruit"', 'name="fruit" aria-label="Choose fruit" aria-labelledby="season kind"')
  await using component = createDisposableCombobox('fruit', namedTemplate)
  const input = component.elements.getInputEl()

  await expect.element(page.getByRole('combobox', { name: 'Seasonal fruit choices' })).toBeVisible()
  expect(input.getAttribute('aria-labelledby')).toBe('season kind')
  document.getElementById('season')!.textContent = 'Updated seasonal'
  await expect.element(page.getByRole('combobox', { name: 'Updated seasonal fruit choices' })).toBeVisible()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/keymap.js#L31-L50 (requires the active modifiers to exactly match the registered key combination)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L857-L861 (registers ArrowDown without modifiers on the input)
it('ignores modified ArrowDown combinations and opens on an unmodified ArrowDown', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getInputEl, getListEl } = component.elements
  const input = getInputEl()
  const list = getListEl()

  await userEvent.tab()
  expect(document.activeElement).toBe(input)
  expect(list.hidden).toBe(true)
  const modifiers = ['Shift', 'Alt', 'Control', 'Meta']
  for (let bits = 1; bits < 16; bits++) {
    const active = modifiers.filter((_, index) => bits & (1 << index))
    await userEvent.keyboard(`${active.map(key => `{${key}>}`).join('')}{ArrowDown}${active.toReversed().map(key => `{/${key}}`).join('')}`)
    expect(list.hidden, `modifier bits ${bits}`).toBe(true)
    expect(document.activeElement).toBe(input)
  }

  await userEvent.keyboard('{ArrowDown}')
  expect(list.hidden).toBe(false)
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L857-L861 (maps both ArrowDown and its legacy Down alias to the input handler)
it('accepts the legacy Down key alias', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getLabelEl, getListEl } = component.elements
  await userEvent.click(getLabelEl())

  // Browsers do not emit this legacy key name through userEvent.keyboard.
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Down', bubbles: true, cancelable: true }))
  expect(getListEl().hidden).toBe(false)
  expect(document.activeElement?.textContent).toBe('Apple')
})
