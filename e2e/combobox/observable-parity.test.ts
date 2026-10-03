import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const values = ['apple', 'apricot', 'banana', 'cherry', 'grape']
const template = `<div data-scope="combobox" data-part="root" id="fruit">
  <label data-part="label">Fruit</label>
  <select data-part="hidden-select" name="fruit">
    <option value="">Choose a fruit</option>
    <option value="apple">Apple</option><option value="apricot">Apricot</option>
    <option value="banana">Banana</option><option value="cherry">Cherry</option>
    <option value="grape">Grape</option>
  </select>
  <input data-part="input">
  <button data-part="clear-trigger" type="button">Clear</button>
  <button data-part="trigger" type="button">Toggle</button>
  <ul data-part="list" style="display:block;position:relative;max-height:60px;overflow-y:auto;margin:0;padding:0"></ul>
  <div data-part="status" role="status"></div>
</div>`

function activeOption(input: HTMLInputElement) {
  const id = input.getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L465-L534 (renders ordered options with listbox metadata and reports the result count)
it('opens with ordered options, listbox metadata, and a live result count', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getInputEl, getSelectEl, getListEl, getStatusEl, getToggleButtonEl, getItemEls } = component.elements
  const input = getInputEl()
  const list = getListEl()

  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(list.hidden).toBe(true)
  await userEvent.click(getToggleButtonEl())

  expect(list.hidden).toBe(false)
  expect(input.getAttribute('aria-expanded')).toBe('true')
  expect(getItemEls().map(item => item.getAttribute('data-value'))).toEqual(values)
  expect(getItemEls().map(item => item.getAttribute('aria-posinset'))).toEqual(['1', '2', '3', '4', '5'])
  expect(getItemEls().map(item => item.getAttribute('aria-setsize'))).toEqual(Array.from({ length: 5 }).fill('5'))
  expect(getStatusEl().textContent).toBe('5 results available.')
  expect(getSelectEl().value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L514-L534 (renders and announces populated and empty result sets)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L592-L603 (clears the values and rebuilds an already-open list)
it('announces one result and no results, then restores the full list on clear', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getInputEl, getListEl, getStatusEl, getClearButtonEl, getItemEls } = component.elements
  const input = getInputEl()
  const list = getListEl()

  await userEvent.fill(input, 'banana')
  expect(getItemEls().map(item => item.textContent)).toEqual(['Banana'])
  expect(getStatusEl().textContent).toBe('1 result available.')

  await userEvent.fill(input, 'zzzz')
  expect(list.hidden).toBe(false)
  expect(getItemEls()).toHaveLength(0)
  expect(list.textContent).toContain('No results found')
  expect(getStatusEl().textContent).toBe('No results.')

  await userEvent.click(getClearButtonEl())
  expect(input.value).toBe('')
  expect(list.hidden).toBe(false)
  expect(getItemEls()).toHaveLength(5)
  expect(getStatusEl().textContent).toBe('5 results available.')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L381-L418 (ranks starts-with matches ahead of other matches)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L481-L509 (derives each rendered option's position and set size)
it('ranks starts-with matches before contains matches and updates option positions', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getInputEl, getItemEls } = component.elements

  await userEvent.fill(getInputEl(), 'ap')
  expect(getItemEls().map(item => item.getAttribute('data-value'))).toEqual(['apple', 'apricot', 'grape'])
  expect(getItemEls().map(item => item.getAttribute('aria-posinset'))).toEqual(['1', '2', '3'])
  expect(getItemEls().map(item => item.getAttribute('aria-setsize'))).toEqual(['3', '3', '3'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L403-L449 (keeps all options and identifies the first query match when filtering is disabled)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L536-L547 (highlights that first match)
it('keeps every option visible when filtering is disabled and highlights the first match', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template.replace('id="fruit"', 'id="fruit" data-disable-filtering="true"'))
  const { getInputEl, getItemEls } = component.elements
  const input = getInputEl()

  await userEvent.fill(input, 'an')
  expect(getItemEls().map(item => item.getAttribute('data-value'))).toEqual(values)
  expect(getItemEls().find(item => item.hasAttribute('data-highlighted'))?.textContent).toBe('Banana')
  expect(activeOption(input)?.textContent).toBe('Banana')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L294-L327 (updates focus, tabindex, highlighting, and aria-activedescendant together)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L793 (uses that shared behavior for arrow navigation and mouse hover)
it('moves focus and the active option together with arrows and mouse hover', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getInputEl, getListEl, getItemEls } = component.elements
  const input = getInputEl()

  await userEvent.tab()
  await userEvent.keyboard('{ArrowDown}')
  await expect.poll(() => document.activeElement?.textContent).toBe('Apple')
  expect(activeOption(input)?.textContent).toBe('Apple')

  await userEvent.keyboard('{ArrowDown}')
  await expect.poll(() => document.activeElement?.textContent).toBe('Apricot')
  expect(activeOption(input)?.textContent).toBe('Apricot')
  expect(getItemEls()[0]?.getAttribute('tabindex')).toBe('-1')
  expect(getItemEls()[1]?.getAttribute('tabindex')).toBe('0')

  await userEvent.hover(getItemEls()[3]!)
  await expect.poll(() => document.activeElement?.textContent).toBe('Cherry')
  expect(activeOption(input)?.textContent).toBe('Cherry')

  await userEvent.keyboard('{ArrowUp}')
  await expect.poll(() => document.activeElement?.textContent).toBe('Banana')
  expect(getListEl().hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L302-L321 (adjusts list scrollTop to keep the highlighted option visible)
it('scrolls keyboard navigation into view in a height-constrained list', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template)
  const { getLabelEl, getListEl, getItemEls } = component.elements

  await userEvent.hover(getLabelEl())
  await userEvent.tab()
  await userEvent.keyboard('{ArrowDown}')
  await expect.poll(() => getItemEls().length).toBe(5)
  for (const item of getItemEls())
    item.style.cssText = 'display:block;height:30px;box-sizing:border-box'

  for (let index = 0; index < 4; index++) {
    await userEvent.keyboard('{ArrowDown}')
    await expect.poll(() => document.activeElement?.textContent).toBe(['Apricot', 'Banana', 'Cherry', 'Grape'][index])
  }
  await expect.poll(() => document.activeElement?.textContent).toBe('Grape')
  expect(getListEl().scrollTop).toBeGreaterThan(0)

  for (let index = 0; index < 4; index++) {
    await userEvent.keyboard('{ArrowUp}')
    await expect.poll(() => document.activeElement?.textContent).toBe(['Cherry', 'Banana', 'Apricot', 'Apple'][index])
  }
  await expect.poll(() => document.activeElement?.textContent).toBe('Apple')
  expect(getListEl().scrollTop).toBe(0)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L118-L125 (disables the visible combobox controls)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L271-L274 (transfers disabled state from the select, then re-enables the select)
it('hard disabled blocks opening while the select remains enabled', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template.replace('id="fruit"', 'id="fruit" data-disabled'))
  const { getInputEl, getSelectEl, getListEl, getToggleButtonEl, getClearButtonEl } = component.elements

  expect(getInputEl().disabled).toBe(true)
  expect(getToggleButtonEl().disabled).toBe(true)
  expect(getClearButtonEl().disabled).toBe(true)
  expect(getClearButtonEl().hidden).toBe(true)
  expect(getSelectEl().disabled).toBe(false)
  expect(getListEl().hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L127-L139 (marks the visible controls aria-disabled without setting their disabled properties)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L276-L279 (transfers aria-disabled from the select during enhancement)
it('soft aria-disabled marks controls but still allows opening', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template.replace('name="fruit"', 'name="fruit" aria-disabled="true"'))
  const { getInputEl, getSelectEl, getListEl, getToggleButtonEl, getClearButtonEl } = component.elements

  expect(getInputEl().disabled).toBe(false)
  expect(getToggleButtonEl().disabled).toBe(false)
  expect(getClearButtonEl().disabled).toBe(false)
  expect(getInputEl().getAttribute('aria-disabled')).toBe('true')
  expect(getToggleButtonEl().getAttribute('aria-disabled')).toBe('true')
  expect(getClearButtonEl().hidden).toBe(true)
  expect(getSelectEl().disabled).toBe(false)
  await userEvent.tab()
  expect(document.activeElement).toBe(getInputEl())
  await userEvent.keyboard('{ArrowDown}')
  await expect.poll(() => getListEl().hidden).toBe(false)
})
