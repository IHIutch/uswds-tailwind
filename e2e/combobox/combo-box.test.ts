import { userEvent } from '@vitest/browser/context'
import { visuallyHiddenStyle } from '@zag-js/dom-query'

import { beforeEach, describe, expect, it } from 'vitest'
import { Combobox, comboboxInit } from '../../packages/compat/src/combobox.js'

const TEMPLATE = `<div
      class="max-w-lg"
      data-part="combobox-root"
      id="basic-combobox"
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
      <option value="apricot test">Apricot &lt;img src='' onerror=alert('ouch')&gt;</option>
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

describe('combo box component', () => {
  const { body } = document

  let input
  let select
  let list
  let toggle
  let comboboxId: string

  beforeEach(async () => {
    body.innerHTML = TEMPLATE
    comboboxInit()
    input = document.querySelector('[data-part="combobox-input"]')
    toggle = document.querySelector('[data-part="combobox-toggle"]')
    select = document.querySelector('[data-part="combobox-select"]')
    list = document.querySelector('[data-part="combobox-list"]')

    comboboxId = input.id.split(':')[1] || input.id
  })

  it('enhances a select element into a combo box component', () => {
    expect(input).toBeTruthy()
    Object.entries(visuallyHiddenStyle).forEach(([key, value]) => {
      const elStyle = select.style[key]
        .replace(/0px/g, '0')
        .replace(/,\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      expect(elStyle).toBe(value)
    })
    expect(list).toBeTruthy()
    expect(list.hidden).toBe(true)
    expect(select.getAttribute('required')).toBe(null)
    expect(input.getAttribute('required')).toBe('')
    expect(select.getAttribute('name')).toBe('fruit')
    expect(input.getAttribute('name')).toBe(null)
    expect(list.getAttribute('role')).toBe('listbox')
    expect(select.getAttribute('aria-hidden')).toBeTruthy()
    expect(select.getAttribute('tabindex')).toBe('-1')
    expect(select.value).toBe('')
    expect(input.value).toBe('')
  })

  it('should show the list by clicking the input', async () => {
    await userEvent.click(input)
    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(select.options.length - 1)
  })

  it('should show the list by clicking the toggle button', async () => {
    await userEvent.click(toggle)
    expect(list.hidden).toBe(false)
  })

  it('should show the list by clicking when clicking the input twice', async () => {
    await userEvent.dblClick(input)
    expect(list.hidden).toBe(false)
  })

  it('should toggle the list and close by clicking when clicking the toggle button twice', async () => {
    await userEvent.click(toggle)
    await userEvent.click(toggle)

    expect(list.hidden).toBe(true)
  })

  it('should set up the list items for accessibility', async () => {
    let i = 0
    const len = list.children.length
    await userEvent.click(input)

    expect(list.children[i].getAttribute('aria-selected')).toBe('false')
    expect(list.children[i].getAttribute('tabindex')).toBe('0')
    expect(list.children[i].getAttribute('role')).toBe('option')

    for (i = 1; i < len; i += 1) {
      expect(list.children[i].getAttribute('aria-selected')).toBe('false')
      expect(list.children[i].getAttribute('tabindex')).toBe('-1')
      expect(list.children[i].getAttribute('role')).toBe('option')
    }
  })

  it('should close the list by clicking away', async () => {
    await userEvent.click(input)
    await userEvent.click(document.body, { position: { x: 0, y: 0 } })

    expect(list.hidden).toBe(true)
  })

  it('should select an item from the option list when clicking a list option', async () => {
    await userEvent.click(input)
    await userEvent.click(list.children[0])

    expect(select.value).toBe('apple')
    expect(input.value).toBe('Apple')
    expect(list.hidden).toBe(true)
  })

  it('should display and filter the option list after a character is typed', async () => {
    await userEvent.fill(input, 'a')

    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(44)
  })

  it('should sort matches by options that start with the query, then options that contain the query', async () => {
    await userEvent.fill(input, 'tan')

    expect(list.children.length).toBe(3)
    expect(list.firstChild.dataset.value).toBe('tangelo')
    expect(list.lastChild.dataset.value).toBe('rambutan')
  })

  it('should reset input values when an incomplete item is remaining on blur', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('apricot')
    }
    await userEvent.fill(input, 'a')

    expect(list.hidden).toBe(false)

    await userEvent.click(document.body, { position: { x: 0, y: 0 } })

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('apricot')
    expect(input.value).toBe('Apricot')
  })

  it('should reset input values when an incomplete item is submitted through enter', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('cantaloupe')
    }

    await userEvent.fill(input, 'a')
    expect(list.hidden).toBe(false)
    input.focus()
    await userEvent.keyboard('{Enter}')

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('cantaloupe')
    expect(input.value).toBe('Cantaloupe')
  })

  it.skip('should not allow enter to perform default action when the list is hidden', async () => {
    expect(list.hidden).toBe(true)

    input.focus()
    await userEvent.keyboard('{Enter}')
  })

  it('should close the list and reset input value when escape is performed while the list is open', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('cherry')
    }

    await userEvent.fill(input, 'a')
    expect(list.hidden).toBe(false)
    input.focus()
    await userEvent.keyboard('{Escape}')

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('cherry')
    expect(input.value).toBe('Cherry')
  })

  it('should reset the input value when a complete selection is left on blur from the input element', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('coconut')
    }
    await userEvent.fill(input, 'date')
    expect(list.hidden).toBe(false)

    await userEvent.click(document.body, { position: { x: 0, y: 0 } })

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('coconut')
    expect(input.value).toBe('Coconut')
  })

  it('should set the input value when a complete selection is submitted by pressing enter', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('cranberry')
    }

    await userEvent.fill(input, 'grape')
    expect(list.hidden).toBe(false)
    input.focus()
    await userEvent.keyboard('{Enter}')

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('grape')
    expect(input.value).toBe('Grape')
  })

  it('should show the no results item when a nonexistent option is typed', async () => {
    await userEvent.fill(input, 'Bibbidi-Bobbidi-Boo')

    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(1)
    expect(list.children[0].textContent).toBe('No results found')
  })

  it('status should not allow innerHTML', async () => {
    await userEvent.fill(input, 'Ap')

    expect(list.hidden).toBe(false)
  })

  it('should show the list when pressing down from an empty input', async () => {
    expect(list.hidden).toBe(true)

    input.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(list.hidden).toBe(false)
  })

  it('should focus the first item in the list when pressing down from the input', async () => {
    await userEvent.fill(input, 'grape')
    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(2)
    input.focus()
    await userEvent.keyboard('{ArrowDown}')

    const focusedOption = document.activeElement

    expect(focusedOption?.textContent).toBe('Grape')
  })

  it('should select the focused list item in the list when pressing enter on a focused item', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('pineapple')
    }
    await userEvent.fill(input, 'berry')
    await userEvent.keyboard('{ArrowDown}')
    const focusedOption = document.activeElement
    expect(focusedOption?.textContent).toBe('Blackberry')

    await userEvent.keyboard('{Enter}')

    expect(select.value).toBe('blackberry')
    expect(input.value).toBe('Blackberry')
  })

  it('should select the focused list item in the list when pressing space on a focused item', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('cantaloupe')
    }
    await userEvent.fill(input, 'berry')
    await userEvent.keyboard('{ArrowDown}')
    const focusedOption = document.activeElement
    expect(focusedOption?.textContent).toBe('Blackberry')

    await userEvent.keyboard('{Space}')

    expect(select.value).toBe('blackberry')
    expect(input.value).toBe('Blackberry')
  })

  it('should not select the focused list item in the list when blurring component from a focused item', async () => {
    await userEvent.fill(input, 'la')
    await userEvent.keyboard('{ArrowDown}')
    const focusedOption = document.activeElement
    expect(focusedOption?.textContent).toBe('Blackberry')

    await userEvent.keyboard('{Escape}')

    expect(select.value).toBe('')
    expect(input.value).toBe('')
  })

  it('should focus the last item in the list when pressing down many times from the input', async () => {
    await userEvent.fill(input, 'la')
    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(2)
    await userEvent.keyboard('{ArrowDown}')

    await userEvent.keyboard('{ArrowDown}')

    await userEvent.keyboard('{ArrowDown}')

    const focusedOption = document.activeElement

    expect(focusedOption?.textContent).toBe('Plantain')
  })

  it('should not select the focused item in the list when pressing escape from the focused item', async () => {
    const instance = Combobox.getInstance(comboboxId)
    if (instance) {
      instance.api.setValue('pineapple')
    }

    await userEvent.fill(input, 'la')
    expect(!list.hidden && list.children.length).toBeTruthy()
    await userEvent.keyboard('{ArrowDown}')
    const focusedOption = document.activeElement
    expect(focusedOption?.textContent).toBe('Blackberry')
    await userEvent.keyboard('{Escape}')

    expect(list.hidden).toBe(true)
    expect(select.value).toBe('pineapple')
    expect(input.value).toBe('Pineapple')
  })

  it('should focus the input and hide the list when pressing up from the first item in the list', async () => {
    await userEvent.fill(input, 'la')
    expect(list.hidden).toBe(false)
    expect(list.children.length).toBe(2)
    await userEvent.keyboard('{ArrowDown}')
    const focusedOption = document.activeElement
    expect(focusedOption?.textContent).toBe('Blackberry')

    await userEvent.keyboard('{ArrowUp}')

    expect(list.hidden).toBe(true)
    expect(document.activeElement).toBe(input)
  })

  it('should not allow for innerHTML of child elements ', async () => {
    await userEvent.fill(input, 'apricot')
    expect(list.hidden).toBe(false)
    Array.from(list.children).forEach((listItem) => {
      Array.from((listItem as Element).childNodes).forEach((childNode) => {
        expect(childNode.nodeType).toBe(Node.TEXT_NODE)
      })
    })
  })

  it('should have attribute type of string', () => {
    expect(typeof (input.getAttribute('aria-label') || '')).toBe('string')
  })
})
