import { expect, it, vi } from 'vitest'
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

it('controlled false takes precedence and requests do not change state until accepted', async () => {
  const onOpenChange = vi.fn()
  await using component = createDisposableModal(id, template(), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })

  expect(component.elements.getContentEl()!.hidden).toBe(true)

  const instance = Modal.getInstance(component.elements.getRootEl())!
  await instance.open()

  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())
  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  expect(component.elements.getContentEl()!.hidden).toBe(true)

  instance.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(component.elements.getContentEl()!.hidden).toBe(false))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('uses authored data-state as the uncontrolled initial state', async () => {
  await using component = createDisposableModal(id, template({ state: 'open' }))

  expect(component.elements.getContentEl()!.hidden).toBe(false)
})

it('explicit props take precedence over authored modal attributes', async () => {
  await using component = createDisposableModal(id, template({ state: 'open', forceAction: true, ariaLabel: 'Authored label' }), {
    'defaultOpen': false,
    'forceAction': false,
    'aria-label': 'Explicit label',
  })

  expect(component.elements.getContentEl()!.hidden).toBe(true)
  expect(component.elements.getContentEl()!.getAttribute('aria-label')).toBe('Explicit label')
  expect(Modal.getInstance(component.elements.getRootEl())!.machine.prop('forceAction')).toBe(false)
})
