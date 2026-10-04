import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Modal } from '../../packages/compat/src/modal.js'
import { createDisposableModal } from './_utils.js'

const id = 'controlled'

function template({ state, forceAction = false, ariaLabel }: { state?: 'open' | 'closed', forceAction?: boolean, ariaLabel?: string } = {}) {
  return `
    <button data-scope="modal" data-part="trigger" data-target="${id}">Open</button>
    <div data-scope="modal" data-part="root" data-value="${id}"${state ? ` data-state="${state}"` : ''}${forceAction ? ' data-force-action' : ''}>
      <div data-part="backdrop"></div>
      <div data-part="positioner">
        <div data-part="content"${ariaLabel ? ` aria-label="${ariaLabel}"` : ''}>
          <button data-part="close-trigger">Close</button>
        </div>
      </div>
    </div>
  `
}

it('opener and close clicks change visibility only after the owner accepts the request', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableModal(id, template(), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })

  await expect.element(component.elements.getContentEl()!).not.toBeVisible()

  const instance = Modal.getInstance(component.elements.getRootEl())!
  await userEvent.click(component.elements.getTriggerEl({})!)

  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())
  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  await expect.element(component.elements.getContentEl()!).not.toBeVisible()

  instance.machine.updateProps({ open: true })
  await expect.element(component.elements.getContentEl()!).toBeVisible()
  expect(onOpenChange).toHaveBeenCalledOnce()

  await userEvent.click(component.elements.getCloseTriggerEl()!)

  expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
  expect(onOpenChange).toHaveBeenCalledTimes(2)
  await expect.element(component.elements.getContentEl()!).toBeVisible()

  instance.machine.updateProps({ open: false })
  await expect.element(component.elements.getContentEl()!).not.toBeVisible()
  await expect.element(component.elements.getTriggerEl({})!).toHaveFocus()
  expect(onOpenChange).toHaveBeenCalledTimes(2)
})

it('uses authored data-state as the uncontrolled initial state', { tags: ['new'] }, async () => {
  await using component = createDisposableModal(id, template({ state: 'open' }))

  await expect.element(component.elements.getContentEl()!).toBeVisible()
  await userEvent.click(component.elements.getCloseTriggerEl()!)
  await expect.element(component.elements.getContentEl()!).not.toBeVisible()
})

it('explicit props override authored visibility, accessible name and Escape behavior', { tags: ['new'] }, async () => {
  await using component = createDisposableModal(id, template({ state: 'open', forceAction: true, ariaLabel: 'Authored label' }), {
    'defaultOpen': false,
    'forceAction': false,
    'aria-label': 'Explicit label',
  })

  await expect.element(component.elements.getContentEl()!).not.toBeVisible()
  await userEvent.click(component.elements.getTriggerEl({})!)
  await expect.element(component.elements.getContentEl()!).toBeVisible()
  await expect.element(component.elements.getContentEl()!).toHaveAccessibleName('Explicit label')
  await expect.element(component.elements.getCloseTriggerEl()!).toHaveFocus()

  await userEvent.keyboard('{Escape}')

  await expect.element(component.elements.getContentEl()!).not.toBeVisible()
  await expect.element(component.elements.getTriggerEl({})!).toHaveFocus()
})
