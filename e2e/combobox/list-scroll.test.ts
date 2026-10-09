import { expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const template = `<style>
  [role=listbox] { display: block; position: relative; max-height: 75px; overflow-y: auto; margin: 0; padding: 0 }
  [role=listbox][hidden] { display: none }
  [role=option] { display: block; height: 30px; box-sizing: border-box }
</style>
<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="apricot">Apricot</option>
    <option value="banana">Banana</option><option value="cherry">Cherry</option>
    <option value="grape">Grape</option>
  </select>
  <input data-part="input">
  <button data-part="trigger" type="button"></button>
  <ul data-part="list"></ul>
  <div data-part="status"></div>
</div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L538-L548 (opening a pristine list highlights the selected option without focusing it)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L307-L318 (highlighting adjusts scrollTop so the option is inside the list)
it('scrolls the selected option into view when the list opens', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template.replace('id="fruit"', 'id="fruit" data-default-value="grape"'))
  const list = component.elements.getListEl()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('Grape')

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))

  await expect.element(list).toBeVisible()
  const grape = page.getByRole('option', { name: 'Grape' }).element() as HTMLElement
  await vi.waitFor(() => expect(list.scrollTop).toBeGreaterThan(0))
  expect(grape.offsetTop).toBeGreaterThanOrEqual(list.scrollTop)
  expect(grape.offsetTop + grape.offsetHeight).toBeLessThanOrEqual(list.scrollTop + list.clientHeight)
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L698 (ArrowDown from the input highlights the already focused option)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L307-L318 (highlighting adjusts scrollTop so the option is inside the list)
it('scrolls the active option back into view when ArrowDown is pressed from the input of an open list', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const list = component.elements.getListEl()

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Grape' })).toHaveFocus()
  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
  await expect.element(list).toBeVisible()
  // The user scrolls the list back to the top.
  list.scrollTop = 0
  await userEvent.keyboard('{ArrowDown}')

  await expect.element(page.getByRole('option', { name: 'Grape' })).toHaveFocus()
  await vi.waitFor(() => expect(list.scrollTop).toBeGreaterThan(0))
})
