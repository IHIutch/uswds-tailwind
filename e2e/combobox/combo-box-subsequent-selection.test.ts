import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'

const TEMPLATE = `<div
      class="max-w-lg"
      data-part="combobox-root"
      id="basic-combobox"
      data-default-value="blackberry"
    >
      <label
        class="combobox-label"
        data-part="combobox-label"
        class="block"
      >Select a fruit:</label>

      <select
        name="fruit"
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
            required
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

      ></div> -->
    </div>`

describe('combo box component - subsequent selection', () => {
  const { body } = document

  let input
  let select
  let list

  beforeEach(async () => {
    body.innerHTML = TEMPLATE
    comboboxInit()
    input = document.querySelector('[data-part="combobox-input"]')
    select = document.querySelector('[data-part="combobox-select"]')
    list = document.querySelector('[data-part="combobox-list"]')
  })

  it('should display the full list and focus the selected item when the input is pristine (after fresh selection)', async () => {
    await userEvent.click(input)

    expect(list.hidden).toBe(false) // should show the option list
    expect(list.children.length).toBe(select.options.length - 1) // should have all of the initial select items in the list except placeholder empty items
    const highlightedOption = list.querySelector('[data-active]')
    expect(highlightedOption).toBeTruthy() // should have an active item in the list
    expect(highlightedOption.textContent).toBe('Blackberry') // should be the previously selected item
  })

  it('should display the filtered list when the input is dirty (characters inputted)', async () => {
    await userEvent.click(input)
    expect(list.children.length).toBe(select.options.length - 1) // should have all of the initial select items in the list except placeholder empty items

    await userEvent.fill(input, 'COBOL')

    // Input has been modified (no pristine state check needed)
    expect(list.children.length).toBe(1) // should only show the filtered items
  })

  it('should show a clear button when the input has a selected value present', () => {
    const clearButton = document.querySelector('[data-part="combobox-clear"]')!
    expect(clearButton).toBeTruthy() // clear input button is present
  })

  it('should clear the input when the clear button is clicked', async () => {
    expect(select.value).toBe('blackberry')
    expect(input.value).toBe('Blackberry')

    const clearButton = document.querySelector('[data-part="combobox-clear"]')!
    await userEvent.click(clearButton)

    expect(select.value).toBe('') // should clear the value on the select
    expect(input.value).toBe('') // should clear the value on the input
    expect(document.activeElement).toBe(input) // should focus the input
  })

  it('should update the filter and begin filtering once a pristine input value is changed', async () => {
    await userEvent.fill(input, 'go')
    await userEvent.click(input)
    input.focus()
    await userEvent.keyboard('{Enter}')
    expect(input.value).toBe('Blackberry') // should set that item to the input value
    await userEvent.click(input)
    expect(list.children.length).toBe(select.options.length - 1) // should have all of the initial select items in the list except placeholder empty items

    await userEvent.fill(input, 'Fig')

    expect(list.children.length).toBe(1) // should only show the filtered items
  })
})
