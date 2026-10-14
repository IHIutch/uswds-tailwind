import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Combobox } from '../../packages/compat/src/combobox.js'
import { createDisposableCombobox } from './_utils.js'

const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="banana">Banana</option>
  </select>
  <input data-part="input">
  <ul data-part="list"></ul>
</div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L118-L125 (disable() disables the focused input, which loses focus)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L845-L851 (focus leaving the combo box resets the selection and hides the list)
it('closes the list and clears typed text when the combobox is disabled while the input has focus', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.fill(page.getByRole('combobox', { name: 'Fruit' }), 'ban')
  await expect.element(page.getByRole('option', { name: 'Banana' })).toBeVisible()
  await Combobox.getInstance(component.elements.getRootEl())!.disable()

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('')
})
