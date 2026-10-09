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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L783-L793 (hover highlights with preventScroll)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L307-L322 (preventScroll skips the scrollTop adjustment and the browser's focus scrolling)
it('focuses a partially visible option under the pointer without scrolling the list', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const list = component.elements.getListEl()

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await expect.element(list).toBeVisible()
  // Banana starts 60px down a 75px list, so only its top 15px are visible.
  await userEvent.hover(page.getByRole('option', { name: 'Banana' }), { position: { x: 100, y: 5 } })

  await expect.element(page.getByRole('option', { name: 'Banana' })).toHaveFocus()
  expect(list.scrollTop).toBe(0)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L783-L793 (hovering the already focused option does nothing)
it('keeps focus in the input when the pointer moves onto the option that is already active', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
  await expect.element(component.elements.getListEl()).toBeVisible()
  await userEvent.hover(page.getByRole('option', { name: 'Apple' }))
  // Let any focus queued for the next animation frame run.
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
})
