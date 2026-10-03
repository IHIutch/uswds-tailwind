import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown, DROPDOWN } from './_utils.js'

const id = 'controlled'

it('controlled false takes precedence and requests wait for the prop update', async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDropdown(id, DROPDOWN({ id }), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })

  expect(component.elements.getContentEl()?.hidden).toBe(true)

  await component.elements.getInstance()?.open()
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())

  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  expect(component.elements.getContentEl()?.hidden).toBe(true)

  component.elements.getInstance()?.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(component.elements.getContentEl()?.hidden).toBe(false))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('a controlled owner can decline a user close request, then accept it', async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableDropdown(id, DROPDOWN({ id }), {
    open: true,
    onOpenChange,
  })

  await userEvent.click(component.elements.getTriggerEl())
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: false }))
  expect(component.elements.getContentEl()?.hidden).toBe(false)

  component.elements.getInstance()?.machine.updateProps({ open: false })
  await vi.waitFor(() => expect(component.elements.getContentEl()?.hidden).toBe(true))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('uses authored data-state as the uncontrolled initial state', async () => {
  await using component = createDisposableDropdown(id, DROPDOWN({ id, state: 'open' }))

  expect(component.elements.getContentEl()?.hidden).toBe(false)
})

it('explicit defaultOpen takes precedence over authored state', async () => {
  await using component = createDisposableDropdown(id, DROPDOWN({ id, state: 'open' }), { defaultOpen: false })

  expect(component.elements.getContentEl()?.hidden).toBe(true)
})

it.each(['pointer', 'keyboard'] as const)('reports the item value once on %s activation without preventing navigation', async (activation) => {
  const onItemSelect = vi.fn()
  await using component = createDisposableDropdown(id, DROPDOWN({
    id,
    content: `
      <li data-part="item" data-value="${id}-item">
        <a href="#${id}-item">${id} item</a>
      </li>
    `,
  }), { onItemSelect })
  await component.elements.getInstance()?.open()
  const link = component.elements.getContentEl()!.querySelector<HTMLAnchorElement>('a')!
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
  await vi.waitFor(() => expect(component.elements.getContentEl()?.hidden).toBe(true))
  expect(document.activeElement).toBe(component.elements.getTriggerEl())
})
