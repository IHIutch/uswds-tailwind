import type * as dropdown from '../../packages/machines/dropdown-compat/src'
import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Dropdown } from '../../packages/compat/src/dropdown.js'
import { createDisposableComponent } from '../_utils.js'
import { createDisposableDropdown } from './_utils.js'

const id = 'controlled'

function TEMPLATE({ state }: { state?: 'open' | 'closed' } = {}) {
  return `
    <nav data-scope="dropdown" data-part="root" id="${id}"${state ? ` data-state="${state}"` : ''}>
      <button data-part="trigger" type="button">Open ${id}</button>
      <ul data-part="content" style="position: absolute">
        <li data-part="item" data-value="${id}-item">
          <a href="#${id}-item">${id} item</a>
        </li>
      </ul>
    </nav>
  `
}

// Props-based construction is explicit here; the shared helper exercises dropdownInit.
function createDisposableDropdownWithProps(template: string, props: dropdown.Props) {
  return createDisposableComponent(
    template,
    () => [new Dropdown(document.getElementById(id), props).init()],
    () => {
      const getRootEl = () => document.getElementById(`dropdown:${id}`)
      const getTriggerEl = () => document.getElementById(`dropdown:${id}:trigger`) as HTMLButtonElement
      const getContentEl = () => document.getElementById(`dropdown:${id}:content`)

      return { getRootEl, getTriggerEl, getContentEl }
    },
  )
}

it('controlled false takes precedence and requests wait for the prop update', async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDropdownWithProps(TEMPLATE(), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })
  const { getRootEl, getContentEl } = component.elements

  expect(getContentEl()?.hidden).toBe(true)

  await Dropdown.getInstance(getRootEl())?.open()
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())

  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  expect(getContentEl()?.hidden).toBe(true)

  Dropdown.getInstance(getRootEl())?.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(getContentEl()?.hidden).toBe(false))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('a controlled owner can decline a user close request, then accept it', async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDropdownWithProps(TEMPLATE(), {
    open: true,
    onOpenChange,
  })
  const { getRootEl, getTriggerEl, getContentEl } = component.elements

  await userEvent.click(getTriggerEl())
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: false }))
  expect(getContentEl()?.hidden).toBe(false)

  Dropdown.getInstance(getRootEl())?.machine.updateProps({ open: false })
  await vi.waitFor(() => expect(getContentEl()?.hidden).toBe(true))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('uses authored data-state as the uncontrolled initial state', async () => {
  await using component = createDisposableDropdown(id, TEMPLATE({ state: 'open' }))
  const { getContentEl } = component.elements

  expect(getContentEl()?.hidden).toBe(false)
})

it('explicit defaultOpen takes precedence over authored state', async () => {
  await using component = createDisposableDropdownWithProps(TEMPLATE({ state: 'open' }), { defaultOpen: false })
  const { getContentEl } = component.elements

  expect(getContentEl()?.hidden).toBe(true)
})

it.each(['pointer', 'keyboard'] as const)('reports the item value once on %s activation without preventing navigation', async (activation) => {
  const onItemSelect = vi.fn()
  await using component = createDisposableDropdownWithProps(TEMPLATE(), { onItemSelect })
  const { getRootEl, getTriggerEl, getContentEl } = component.elements
  await Dropdown.getInstance(getRootEl())?.open()
  const link = getContentEl()!.querySelector<HTMLAnchorElement>('a')!
  const defaultPrevented = vi.fn<(prevented: boolean) => void>()
  document.addEventListener('click', event => defaultPrevented(event.defaultPrevented), { once: true })

  if (activation === 'pointer') {
    await userEvent.click(link)
  }
  else {
    link.focus()
    await userEvent.keyboard('{Enter}')
  }
  await vi.waitFor(() => expect(onItemSelect).toHaveBeenCalledOnce())

  expect(onItemSelect).toHaveBeenCalledWith({ value: `${id}-item` })
  expect(defaultPrevented).toHaveBeenCalledWith(false)
  await vi.waitFor(() => expect(getContentEl()?.hidden).toBe(true))
  expect(document.activeElement).toBe(getTriggerEl())
})
