import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="apricot">Apricot</option>
    <option value="banana">Banana</option><option value="cherry">Cherry</option>
    <option value="grape">Grape</option>
  </select>
  <input data-part="input">
  <button data-part="clear-trigger" type="button"></button>
  <button data-part="trigger" type="button"></button>
  <ul data-part="list"></ul>
  <div data-part="status"></div>
</div>
<button type="button">Outside</button>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L800-L810 (the toggle button opens or closes the list, then always focuses the input)
it('moves focus to the input when the toggle button opens the list while focus is elsewhere on the page', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('button', { name: 'Outside' }))
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).not.toHaveFocus()
  await userEvent.click(page.getByRole('button', { name: 'Toggle the dropdown list' }))

  await expect.element(component.elements.getListEl()).toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L800-L810 (the toggle button opens or closes the list, then always focuses the input)
it('returns focus to the input when the toggle button closes the list from a focused option', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.click(page.getByRole('button', { name: 'Toggle the dropdown list' }))

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L577-L585 (selecting an option hides the list and focuses the input)
it('returns focus to the input after the pointer selects an option', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.click(page.getByRole('option', { name: 'Banana' }))

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('Banana')
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L669-L675 (Escape hides the list, resets the selection and focuses the input)
it('returns focus to the input when Escape closes the list from a focused option', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.keyboard('{Escape}')

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})
