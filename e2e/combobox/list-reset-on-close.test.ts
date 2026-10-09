import { expect, it } from 'vitest'
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L556-L570 (hiding the list empties aria-activedescendant)
it('stops referencing an active option once the list closes', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const input = page.getByRole('combobox', { name: 'Fruit' })

  await userEvent.click(input)
  await userEvent.keyboard('{ArrowDown}{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apricot' })).toHaveFocus()
  await expect.element(input).toHaveAttribute('aria-activedescendant', page.getByRole('option', { name: 'Apricot' }).element().id)
  await userEvent.keyboard('{Escape}')

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  expect(input.element().getAttribute('aria-activedescendant') ?? '').toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L556-L570 (hiding the list resets its scrollTop to 0)
it('reopens scrolled to the first option after closing a list that was scrolled down', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const list = component.elements.getListEl()

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Grape' })).toHaveFocus()
  await expect.poll(() => list.scrollTop).toBeGreaterThan(0)
  await userEvent.keyboard('{Escape}')
  await expect.element(list).not.toBeVisible()
  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))

  await expect.element(list).toBeVisible()
  expect(list.scrollTop).toBe(0)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L698 (ArrowDown from the input shows a hidden list and focuses its first option)
it('reopens the list and focuses the first option when ArrowDown follows Escape', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.keyboard('{Escape}')
  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}')

  await expect.element(component.elements.getListEl()).toBeVisible()
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
})
