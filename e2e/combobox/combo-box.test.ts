import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCombobox } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `<div
      class="max-w-lg"
      data-scope="combobox" data-part="root"
      id="${rootId}"
    >
      <label
        class="combobox-label"
        data-part="label"
        class="block"
      >Select a fruit:</label>

      <select
        name="fruit"
        data-part="hidden-select"
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
        <div class="flex w-full" style="display:flex">
          <input
            required
            data-part="input"
            class="pr-10 p-2 bg-white w-full h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
          >
          <div class="absolute z-10 inset-y-0 right-0 flex">
            <button
              class="h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50"
              data-part="clear-trigger"
              type="button"
            >
              <div class="icon-[material-symbols--close] size-6"></div>
            </button>
            <button
              class="h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50"
              data-part="trigger"
              type="button"
            >
              <div class="icon-[material-symbols--expand-more] size-8"></div>
            </button>
          </div>
        </div>
        <ul
          data-part="list"
          class="absolute border border-t-0 border-gray-60 bg-white max-h-52 overflow-y-scroll w-full z-10"
        >
        </ul>
      </div>
      <!-- <div
        class="combobox-status"
        data-part="status"
        role="status"

      ></div> -->
    </div>`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L160-L282
it('enhances a select element into a combo box component', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  expect(input).toBeTruthy()
  expect(select).not.toBeVisible()
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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L797-L839
it('should show the list by clicking the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.click(input)
  expect(list.hidden).toBe(false)
  expect(list.children.length).toBe(select.options.length - 1)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L797-L839
it('should show the list by clicking the toggle button', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const toggle = component.elements.getToggleButtonEl()!
  const list = component.elements.getListEl()!

  await userEvent.click(toggle)
  expect(list.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L797-L839
it('should show the list by clicking when clicking the input twice', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.dblClick(input)
  expect(list.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L797-L839
it('should toggle the list and close by clicking when clicking the toggle button twice', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const toggle = component.elements.getToggleButtonEl()!
  const list = component.elements.getListEl()!

  await userEvent.click(toggle)
  await userEvent.click(toggle)

  expect(list.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L481-L534
it('should set up the list items for accessibility', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  let i = 0
  await userEvent.click(input)
  const len = list.children.length

  expect(list.children[i].getAttribute('aria-selected')).toBe('false')
  expect(list.children[i].getAttribute('tabindex')).toBe('0')
  expect(list.children[i].getAttribute('role')).toBe('option')

  for (i = 1; i < len; i += 1) {
    expect(list.children[i].getAttribute('aria-selected')).toBe('false')
    expect(list.children[i].getAttribute('tabindex')).toBe('-1')
    expect(list.children[i].getAttribute('role')).toBe('option')
  }
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L632
it('should close the list by clicking away', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, `${TEMPLATE}<button id="outside">Outside</button>`)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.click(input)
  await userEvent.click(document.getElementById('outside')!)

  expect(list.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L577-L585
it('should select an item from the option list when clicking a list option', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.click(input)
  await userEvent.click(list.children[0])

  expect(select.value).toBe('apple')
  expect(input.value).toBe('Apple')
  expect(list.hidden).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L403-L449
it('should display and filter the option list after a character is typed', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'a')

  expect(list.hidden).toBe(false)
  expect(list.children.length).toBe(44)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L403-L449
it('should sort matches by options that start with the query, then options that contain the query', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'tan')

  expect(list.children.length).toBe(3)
  expect(list.children[0].getAttribute('data-value')).toBe('tangelo')
  expect(list.children[2].getAttribute('data-value')).toBe('rambutan')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L632
it('should reset input values when an incomplete item is remaining on blur', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, `${TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="apricot"')}<button id="outside">Outside</button>`)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'a')

  expect(list.hidden).toBe(false)

  await userEvent.click(document.getElementById('outside')!)

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('apricot')
  expect(input.value).toBe('Apricot')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L642-L716
it('should reset input values when an incomplete item is submitted through enter', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="cantaloupe"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.hover(component.elements.getLabelEl())
  await userEvent.fill(input, 'a')
  expect(list.hidden).toBe(false)
  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('cantaloupe')
  expect(input.value).toBe('Cantaloupe')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L705-L716
it('prevents Enter in a closed combobox from submitting its form', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, `<form id="fruit-form">${TEMPLATE}<button type="submit">Submit</button></form>`)
  const input = component.elements.getInputEl()
  const form = document.getElementById('fruit-form')!
  let submissions = 0
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submissions++
  })

  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(submissions).toBe(0)
  expect(component.elements.getListEl().hidden).toBe(true)
  expect(input.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L674
it('should close the list and reset input value when escape is performed while the list is open', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="cherry"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'a')
  expect(list.hidden).toBe(false)
  input.focus()
  await userEvent.keyboard('{Escape}')

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('cherry')
  expect(input.value).toBe('Cherry')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L632
it('should reset the input value when a complete selection is left on blur from the input element', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, `${TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="coconut"')}<button id="outside">Outside</button>`)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'date')
  expect(list.hidden).toBe(false)

  await userEvent.click(document.getElementById('outside')!)

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('coconut')
  expect(input.value).toBe('Coconut')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L642-L716
it('should set the input value when a complete selection is submitted by pressing enter', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="cranberry"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'grape')
  expect(list.hidden).toBe(false)
  input.focus()
  await userEvent.keyboard('{Enter}')

  expect(list.hidden).toBe(true)
  expect(select.value).toBe('grape')
  expect(input.value).toBe('Grape')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L514-L534
it('should show the no results item when a nonexistent option is typed', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'Bibbidi-Bobbidi-Boo')

  expect(list.hidden).toBe(false)
  expect(list.children.length).toBe(1)
  expect(list.children[0].textContent).toBe('No results found')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L514-L534
it('announces no results without rendering typed markup', { tags: ['legacy'] }, async () => {
  const markup = TEMPLATE.replace(/<!--[\s\S]*?data-part="status"[\s\S]*?-->/, '<div data-part="status" role="status"></div>')
  await using component = createDisposableCombobox(rootId, markup)

  await userEvent.fill(component.elements.getInputEl(), '<b>Apple</b>')

  expect(component.elements.getStatusEl().textContent).toBe('No results.')
  expect(component.elements.getStatusEl().querySelector('b')).toBeNull()
  expect(component.elements.getListEl().textContent).toBe('No results found')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L731
it('should show the list when pressing down from an empty input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  expect(list.hidden).toBe(true)

  input.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(list.hidden).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L731
it('should focus the first item in the list when pressing down from the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'grape')
  expect(list.hidden).toBe(false)
  expect(list.children.length).toBe(2)
  input.focus()
  await userEvent.keyboard('{ArrowDown}')

  const focusedOption = document.activeElement

  expect(focusedOption?.textContent).toBe('Grape')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L642-L716
it('should select the focused list item in the list when pressing enter on a focused item', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="pineapple"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  await userEvent.hover(component.elements.getLabelEl())
  await userEvent.fill(input, 'berry')
  await userEvent.keyboard('{ArrowDown}')
  const focusedOption = document.activeElement
  expect(focusedOption?.textContent).toBe('Blackberry')

  await userEvent.keyboard('{Enter}')

  expect(select.value).toBe('blackberry')
  expect(input.value).toBe('Blackberry')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L739-L752
it('should select the focused list item in the list when pressing space on a focused item', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="cantaloupe"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!

  await userEvent.hover(component.elements.getLabelEl())
  await userEvent.fill(input, 'berry')
  await userEvent.keyboard('{ArrowDown}')
  const focusedOption = document.activeElement
  expect(focusedOption?.textContent).toBe('Blackberry')

  await userEvent.keyboard('{Space}')

  expect(select.value).toBe('blackberry')
  expect(input.value).toBe('Blackberry')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L632
it('should not select the focused list item in the list when blurring component from a focused item', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!

  await userEvent.fill(input, 'la')
  await userEvent.keyboard('{ArrowDown}')
  const focusedOption = document.activeElement
  expect(focusedOption?.textContent).toBe('Blackberry')

  await userEvent.keyboard('{Escape}')

  expect(select.value).toBe('')
  expect(input.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L682-L731
it('should focus the last item in the list when pressing down many times from the input', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

  await userEvent.fill(input, 'la')
  expect(list.hidden).toBe(false)
  expect(list.children.length).toBe(2)
  await userEvent.keyboard('{ArrowDown}')

  await userEvent.keyboard('{ArrowDown}')

  await userEvent.keyboard('{ArrowDown}')

  const focusedOption = document.activeElement

  expect(focusedOption?.textContent).toBe('Plantain')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L610-L674
it('should not select the focused item in the list when pressing escape from the focused item', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE.replace('data-part="root"', 'data-part="root" data-default-value="pineapple"'))
  const input = component.elements.getInputEl()!
  const select = component.elements.getSelectEl()!
  const list = component.elements.getListEl()!

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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L759-L776
it('should focus the input and hide the list when pressing up from the first item in the list', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()!
  const list = component.elements.getListEl()!

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

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L499-L511
it('displays and selects option labels as literal text instead of markup', { tags: ['legacy'] }, async () => {
  const markup = TEMPLATE.replace('>Apricot</option>', '>&lt;b&gt;Apricot&lt;/b&gt;</option>')
  await using component = createDisposableCombobox(rootId, markup)

  await userEvent.fill(component.elements.getInputEl(), 'apricot')
  const option = component.elements.getItemEls().find(item => item.textContent === '<b>Apricot</b>')!
  expect(option.textContent).toBe('<b>Apricot</b>')
  expect(option.querySelector('b')).toBeNull()
  await userEvent.click(option)
  expect(component.elements.getInputEl().value).toBe('<b>Apricot</b>')
  expect(component.elements.getSelectEl().value).toBe('apricot')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-combo-box/src/index.js#L222-L245
it('provides a text input that accepts typed search text', { tags: ['legacy'] }, async () => {
  await using component = createDisposableCombobox(rootId, TEMPLATE)
  const input = component.elements.getInputEl()

  expect(input.type).toBe('text')
  await userEvent.fill(input, 'banana')
  expect(input.value).toBe('banana')
  expect(component.elements.getItemEls().map(item => item.textContent)).toEqual(['Banana'])
})
