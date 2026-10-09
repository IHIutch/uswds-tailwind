import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { expectNever } from '../_utils.js'
import { createDisposableCombobox } from './_utils.js'

const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="apricot">Apricot</option>
    <option value="banana">Banana</option>
  </select>
  <input data-part="input">
  <ul data-part="list"></ul>
</div>`

it('does not pull focus back to an option after focus is moved elsewhere programmatically', { tags: ['new'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const input = component.elements.getInputEl()

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  page.getByRole('option', { name: 'Apricot' }).element().addEventListener('focus', () => input.focus(), { once: true })
  await userEvent.keyboard('{ArrowDown}')
  await expectNever(() => expect(document.activeElement).toBe(page.getByRole('option', { name: 'Apricot' }).element()))

  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
  await expect.element(component.elements.getListEl()).toBeVisible()
})
