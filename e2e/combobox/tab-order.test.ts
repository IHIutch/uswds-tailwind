import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="banana">Banana</option>
  </select>
  <input data-part="input">
  <button data-part="clear-trigger" type="button"></button>
  <button data-part="trigger" type="button"></button>
  <ul data-part="list"></ul>
</div>
<button type="button">Outside</button>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L246-L252 (the clear button stays in the tab order; the toggle button has tabindex="-1")
it('skips the toggle button when tabbing forward from the input', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{Escape}')
  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await userEvent.tab()
  await expect.element(page.getByRole('button', { name: 'Clear the select contents' })).toHaveFocus()
  await userEvent.tab()

  await expect.element(page.getByRole('button', { name: 'Outside' })).toHaveFocus()
})
