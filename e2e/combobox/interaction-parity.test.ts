import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const fruitOptions = `<option value="apple">Apple</option><option value="apricot">Apricot</option>
  <option value="banana">Banana</option><option value="cherry">Cherry</option><option value="grape">Grape</option>`

function template(id: string, options = fruitOptions) {
  return `<div data-scope="combobox" data-part="root" id="${id}">
    <label data-part="label">Fruit</label>
    <select data-part="hidden-select" name="${id}">
      <option value="">Choose a fruit</option>${options}
    </select>
    <input data-part="input">
    <button data-part="clear-trigger" type="button">Clear</button>
    <button data-part="trigger" type="button">Toggle</button>
    <ul data-part="list"></ul>
  </div>`
}

interface ChangeRecord {
  target: string
  value: string
  detail: unknown
  bubbles: boolean
  cancelable: boolean
  constructor: string
}

function changes(root: HTMLElement) {
  const records: ChangeRecord[] = []
  root.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement
    records.push({
      target: target.tagName.toLowerCase(),
      value: target.value,
      detail: (event as CustomEvent).detail,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      constructor: event.constructor.name,
    })
  })
  return records
}

function changed(target: string, value: string): ChangeRecord {
  return { target, value, detail: { value }, bubbles: true, cancelable: true, constructor: 'CustomEvent' }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L577-L585 (commits the clicked option to the select and input)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L827-L839 (routes option clicks to the selection behavior)
it('commits a choice through a full pointer click', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template('fruit'))
  const { getInputEl, getSelectEl, getToggleButtonEl, getItemEls } = component.elements

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[0]!)
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['apple', 'Apple'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L44-L54 (every value write dispatches the bubbling, cancelable CustomEvent with its value in detail)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L577-L603 (selection and clearing write both source elements)
it('emits the source change events when selecting, reselecting, and clearing', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', template('fruit'))
  const { getRootEl, getInputEl, getSelectEl, getToggleButtonEl, getClearButtonEl, getItemEls } = component.elements
  const events = changes(getRootEl())

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[0]!)
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['apple', 'Apple'])
  expect(events).toEqual([changed('select', 'apple'), changed('input', 'Apple')])

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[0]!)
  await expect.poll(() => events.length).toBe(4)
  expect(events).toEqual([
    changed('select', 'apple'),
    changed('input', 'Apple'),
    changed('select', 'apple'),
    changed('input', 'Apple'),
  ])

  await userEvent.click(getClearButtonEl())
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['', ''])
  expect(events.slice(-2)).toEqual([changed('select', ''), changed('input', '')])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L632 (restores the input text from the committed select value)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L845-L850 (resets the selection and hides the list when focus leaves the component)
it('restores a committed choice on a real outside focus move, including while closed', { tags: ['parity'] }, async () => {
  await using component = createDisposableCombobox('fruit', `${template('fruit')}<button id="outside">Outside</button>`)
  const { getInputEl, getSelectEl, getListEl, getToggleButtonEl, getItemEls } = component.elements
  const input = getInputEl()
  const outside = document.getElementById('outside') as HTMLButtonElement

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[2]!)
  await expect.poll(() => getSelectEl().value).toBe('banana')
  await userEvent.click(outside)
  expect([getSelectEl().value, input.value, getListEl().hidden]).toEqual(['banana', 'Banana', true])

  await userEvent.fill(input, 'app')
  await expect.poll(() => getListEl().hidden).toBe(false)
  await userEvent.click(outside)
  await expect.poll(() => [getListEl().hidden, input.value]).toEqual([true, 'Banana'])
  expect(getSelectEl().value).toBe('banana')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L79-L110 (resolves every operation against the closest combobox and its own elements)
it('keeps two comboboxes and their form values independent', { tags: ['parity'] }, async () => {
  const markup = `<form id="fruit-form">${template('fruit')}${template('other', '<option value="carrot">Carrot</option><option value="celery">Celery</option>')}</form>`
  await using component = createDisposableCombobox('fruit', markup)
  const { getInputEl, getToggleButtonEl, getItemEls } = component.elements
  const form = document.getElementById('fruit-form') as HTMLFormElement

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[0]!)
  await expect.poll(() => getInputEl().value).toBe('Apple')
  expect(getInputEl('other').value).toBe('')
  expect(new FormData(form).get('fruit')).toBe('apple')
  expect(new FormData(form).get('other')).toBe('')

  await userEvent.click(getToggleButtonEl('other'))
  await userEvent.click(getItemEls('other')[1]!)
  await expect.poll(() => getInputEl('other').value).toBe('Celery')
  expect(getInputEl().value).toBe('Apple')
  expect(new FormData(form).get('fruit')).toBe('apple')
  expect(new FormData(form).get('other')).toBe('celery')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L465-L509 (builds each native option into its own positioned list item)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L577-L585 (commits the clicked item's value and text)
it('selects the intended occurrence when option values or labels repeat', { tags: ['parity'] }, async () => {
  const options = `<option value="same">First same</option><option value="same">Second same</option>
    <option value="right">Same label</option><option value="left">Same label</option>`
  await using component = createDisposableCombobox('fruit', template('fruit', options))
  const { getInputEl, getSelectEl, getToggleButtonEl, getItemEls } = component.elements

  await userEvent.click(getToggleButtonEl())
  await userEvent.click(getItemEls()[1]!)
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['same', 'Second same'])
  await userEvent.click(getToggleButtonEl())
  expect(getItemEls().map(item => item.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false', 'false'])

  await userEvent.click(getItemEls()[3]!)
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['left', 'Same label'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L465-L509 (renders matching native options without excluding or disabling disabled options)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L827-L839 (allows any rendered list option to be selected by click)
it('allows navigation and selection of an option marked disabled in the native select', { tags: ['parity'] }, async () => {
  const options = '<option value="a" disabled>A</option><option value="b">B</option>'
  await using component = createDisposableCombobox('fruit', template('fruit', options))
  const { getInputEl, getSelectEl, getToggleButtonEl, getItemEls } = component.elements

  await userEvent.click(getToggleButtonEl())
  expect(getItemEls().map(item => item.textContent)).toEqual(['A', 'B'])
  expect(getItemEls()[0]?.getAttribute('aria-disabled')).toBeNull()
  await userEvent.click(getItemEls()[0]!)
  await expect.poll(() => [getSelectEl().value, getInputEl().value]).toEqual(['a', 'A'])
})
