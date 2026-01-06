import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Combobox } from '../../packages/compat/src/combobox.js'
import { createDisposableCombobox } from './_utils.js'

const rootId = 'basic-combobox'

const template = `<div
  class="max-w-lg"
  data-part="combobox-root"
  id="${rootId}"
    >
      <label
        class="combobox-label"
        data-part="combobox-label"
        class="block"
      >Select a fruit:</label>

      <select
        data-part="combobox-select"
        hidden
      >
        <option value>Select a fruit</option>
      <option value="apple">Apple</option>
      <option value="apricot">Apricot</option>
      <option value="avocado">Avocado</option>
      <option value="banana">Banana</option>
      <option value="blackberry">Blackberry</option>
      <option value="blood orange">Blood orange</option>
      <option value="blueberry">Blueberry</option>
      <option value="boysenberry">Boysenberry</option>
      <option value="breadfruit">Breadfruit</option>
      <option value="buddhas hand citron">Buddha's hand citron</option>
      <option value="cantaloupe">Cantaloupe</option>
      <option value="clementine">Clementine</option>
      <option value="crab apple">Crab apple</option>
      <option value="currant">Currant</option>
      <option value="cherry">Cherry</option>
      <option value="custard apple">Custard apple</option>
      <option value="coconut">Coconut</option>
      <option value="cranberry">Cranberry</option>
      <option value="date">Date</option>
      <option value="dragonfruit">Dragonfruit</option>
      <option value="durian">Durian</option>
      <option value="elderberry">Elderberry</option>
      <option value="fig">Fig</option>
      <option value="gooseberry">Gooseberry</option>
      <option value="grape">Grape</option>
      <option value="grapefruit">Grapefruit</option>
      <option value="guava">Guava</option>
      <option value="honeydew melon">Honeydew melon</option>
      <option value="jackfruit">Jackfruit</option>
      <option value="kiwifruit">Kiwifruit</option>
      <option value="kumquat">Kumquat</option>
      <option value="lemon">Lemon</option>
      <option value="lime">Lime</option>
      <option value="lychee">Lychee</option>
      <option value="mandarine">Mandarine</option>
      <option value="mango">Mango</option>
      <option value="mangosteen">Mangosteen</option>
      <option value="marionberry">Marionberry</option>
      <option value="nectarine">Nectarine</option>
      <option value="orange">Orange</option>
      <option value="papaya">Papaya</option>
      <option value="passionfruit">Passionfruit</option>
      <option value="peach">Peach</option>
      <option value="pear">Pear</option>
      <option value="persimmon">Persimmon</option>
      <option value="plantain">Plantain</option>
      <option value="plum">Plum</option>
      <option value="pineapple">Pineapple</option>
      <option value="pluot">Pluot</option>
      <option value="pomegranate">Pomegranate</option>
      <option value="pomelo">Pomelo</option>
      <option value="quince">Quince</option>
      <option value="raspberry">Raspberry</option>
      <option value="rambutan">Rambutan</option>
      <option value="soursop">Soursop</option>
      <option value="starfruit">Starfruit</option>
      <option value="strawberry">Strawberry</option>
      <option value="tamarind">Tamarind</option>
      <option value="tangelo">Tangelo</option>
      <option value="tangerine">Tangerine</option>
      <option value="ugli fruit">Ugli fruit</option>
      <option value="watermelon">Watermelon</option>
      <option value="white currant">White currant</option>
      <option value="yuzu">Yuzu</option>
      </select>

      <div class="relative mt-2">
        <div class="flex w-full">
          <input
            data-part="combobox-input"
            class="pr-10 p-2 bg-white w-full h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
          >
          <div class="absolute z-10 inset-y-0 right-0 flex">
            <button
              class="h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50"
              data-part="combobox-clear"
              type="button"
            >
              <div class="icon-[material-symbols--close] size-6"></div>
            </button>
            <button
              class="h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50"
              data-part="combobox-toggle"
              type="button"
            >
              <div class="icon-[material-symbols--expand-more] size-8"></div>
            </button>
          </div>
        </div>
        <ul
          data-part="combobox-list"
          class="absolute border border-t-0 border-gray-60 bg-white max-h-52 overflow-y-scroll w-full z-10"
        >
        </ul>
      </div>
      <!-- <div
        class="combobox-status"
        data-part="combobox-status"
        role="status"

    </div>`

it('enhances a select element into a combo box component', () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()
  const select = component.elements.getSelectEl()
  const list = component.elements.getListEl()

  expect(input).toBeTruthy()
  expect(select).toBeTruthy()
  expect(list).toBeTruthy()
})

it('should emit change events when selecting an item from the option list when clicking a list option', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.clear(input)
  await userEvent.click(input)
  await userEvent.click(list.children[0])

  expect(select.value).toBe('apple')
  expect(input.value).toBe('Apple')
})

it('should emit change events when resetting input values when an incomplete item is submitted through enter', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  const instance = Combobox.getInstance(rootId)
  instance?.api.setValue('apple')

  await userEvent.clear(input)
  await userEvent.fill(input, 'a')
  expect(list.hidden).toBe(false)

  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(select.value).toBe('apple')
  expect(input.value).toBe('Apple')
})

it('should emit change events when closing the list but not the clear the input value when escape is performed while the list is open', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  const instance = Combobox.getInstance(rootId)
  instance?.api.setValue('apple')
  await userEvent.fill(input, 'a')
  expect(list.hidden).toBe(false)

  input.focus()
  await userEvent.keyboard('{Escape}')

  expect(select.value).toBe('apple')
  expect(input.value).toBe('Apple')
})

it('should emit change events when setting the input value when a complete selection is submitted by pressing enter', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  const instance = Combobox.getInstance(rootId)
  instance?.api.setValue('apple')
  await userEvent.fill(input, 'fig')
  expect(list.hidden).toBe(false)

  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(select.value).toBe('fig')
  expect(input.value).toBe('Fig')
})

it('should emit change events when selecting the focused list item in the list when pressing enter on a focused item', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!

  const instance = Combobox.getInstance(rootId)
  instance?.api.setValue('grapefruit')
  await userEvent.fill(input, 'emo')

  await userEvent.keyboard('{ArrowDown}')
  const focusedOption = document.activeElement
  expect(focusedOption?.textContent).toBe('Lemon')
  await userEvent.keyboard('{Enter}')

  expect(select.value).toBe('lemon')
  expect(input.value).toBe('Lemon')
})

it('should emit change events when pressing escape from a focused item', async () => {
  using component = createDisposableCombobox(rootId, template)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  const instance = Combobox.getInstance(rootId)
  instance?.api.setValue('grapefruit')
  await userEvent.fill(input, 'dew')
  expect(!list.hidden && list.children.length).toBeTruthy()

  await userEvent.keyboard('{ArrowDown}')
  const focusedOption = document.activeElement
  expect(focusedOption?.textContent).toBe('Honeydew melon')

  await userEvent.keyboard('{Escape}')

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('grapefruit')
  expect(input.value).toBe('Grapefruit')
})
