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
  <button data-part="trigger" type="button"></button>
  <ul data-part="list"></ul>
  <div data-part="status"></div>
</div>`

// Room above and below the combobox, so an arrow key's default action could scroll the page either way.
const scrollablePageTemplate = `<div style="height: 1000px"></div>${template}<div style="height: 3000px"></div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L862-L866 (options accept the legacy Up and Down key names)
it('moves between options with the legacy Down and Up key names', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  // Browsers do not emit these legacy key names through userEvent.keyboard.
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Down', bubbles: true, cancelable: true }))
  await expect.element(page.getByRole('option', { name: 'Apricot' })).toHaveFocus()
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Up', bubbles: true, cancelable: true }))

  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await expect.element(component.elements.getListEl()).toBeVisible()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/keymap.js#L31-L50 (requires the active modifiers to exactly match the registered key combination)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L862-L869 (registers the option keys without modifiers)
it('ignores arrow, Enter and Space keys pressed with a modifier on a focused option', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
  await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}')
  await userEvent.keyboard('{Control>}{ArrowUp}{/Control}')
  await userEvent.keyboard('{Control>}{Enter}{/Control}')
  await userEvent.keyboard('{Alt>}{ }{/Alt}')
  // An unmodified ArrowDown lands on the second option only if none of the keys above acted.
  await userEvent.keyboard('{ArrowDown}')

  await expect.element(page.getByRole('option', { name: 'Apricot' })).toHaveFocus()
  await expect.element(component.elements.getListEl()).toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveValue('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/keymap.js#L31-L50 (requires the active modifiers to exactly match the registered key combination)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L854-L856 (registers Escape without modifiers on the combo box)
it('keeps the list open when Escape is pressed with Shift', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  await userEvent.keyboard('{Shift>}{Escape}{/Shift}')
  // ArrowDown from an option only moves within an open list.
  await userEvent.keyboard('{ArrowDown}')

  await expect.element(page.getByRole('option', { name: 'Apricot' })).toHaveFocus()
  await expect.element(component.elements.getListEl()).toBeVisible()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L723-L732 (ArrowDown on an option prevents the default page scroll)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L759-L775 (ArrowUp on an option prevents the default page scroll while the list is shown)
it('does not scroll the page when arrow keys move between options', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', scrollablePageTemplate)

  await userEvent.click(page.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(page.getByRole('option', { name: 'Apple' })).toHaveFocus()
  const scrollY = window.scrollY
  expect(scrollY).toBeGreaterThan(0)
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}')
  await expect.element(page.getByRole('option', { name: 'Apricot' })).toHaveFocus()
  expect(window.scrollY).toBe(scrollY)
  await userEvent.keyboard('{ArrowUp}{ArrowUp}')

  await expect.element(component.elements.getListEl()).not.toBeVisible()
  await expect.element(page.getByRole('combobox', { name: 'Fruit' })).toHaveFocus()
  expect(window.scrollY).toBe(scrollY)
})
