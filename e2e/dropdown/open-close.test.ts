import { expect, it } from 'vitest'
import { Dropdown } from '../../packages/compat/src/dropdown.js'
import { createDisposableDropdown } from './_utils.js'

const id = 'test'

function TEMPLATE() {
  return `
    <nav data-scope="dropdown" data-part="root" id="${id}">
      <button data-part="trigger" type="button">Open ${id}</button>
      <ul data-part="content" style="position: absolute">
        <li data-part="item" data-value="${id}-item">
          <a href="#${id}-item">${id} item</a>
        </li>
      </ul>
    </nav>
  `
}

it('open() opens the dropdown', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, TEMPLATE())
  const { getRootEl, getContentEl } = component.elements
  const instance = Dropdown.getInstance(getRootEl())!

  await instance.open()

  expect(getContentEl()?.hidden).toBe(false)
})

it('close() closes the dropdown', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, TEMPLATE())
  const { getRootEl, getContentEl } = component.elements
  const instance = Dropdown.getInstance(getRootEl())!
  await instance.open()

  await instance.close()

  expect(getContentEl()?.hidden).toBe(true)
})

it('repeated open() and close() calls are no-ops', { tags: ['new'] }, async () => {
  await using component = createDisposableDropdown(id, TEMPLATE())
  const { getRootEl, getContentEl } = component.elements
  const instance = Dropdown.getInstance(getRootEl())!

  await instance.open()
  await instance.open()
  expect(getContentEl()?.hidden).toBe(false)

  await instance.close()
  await instance.close()
  expect(getContentEl()?.hidden).toBe(true)
})
