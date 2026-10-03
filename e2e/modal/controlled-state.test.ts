import type * as modal from '../../packages/machines/modal-compat/src'
import { expect, it, vi } from 'vitest'
import { Modal } from '../../packages/compat/src/modal.js'
import { createDisposableComponent } from '../_utils.js'

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

function createModal(markup: string, props: modal.Props) {
  let instance: Modal
  return createDisposableComponent(
    markup,
    () => {
      const rootEl = document.querySelector<HTMLElement>('[data-scope="modal"][data-part="root"]')!
      instance = new Modal(rootEl, props).init()
      return [instance]
    },
    () => ({
      instance,
      content: document.getElementById(`modal:${id}:content`)!,
      trigger: document.getElementById(`modal:${id}:trigger:0`)!,
    }),
  )
}

it('controlled false takes precedence and requests do not change state until accepted', async () => {
  const onOpenChange = vi.fn()
  await using component = createModal(template(), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })

  expect(component.elements.content.hidden).toBe(true)

  await component.elements.instance.open()

  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledOnce())
  expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  expect(component.elements.content.hidden).toBe(true)

  component.elements.instance.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(component.elements.content.hidden).toBe(false))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('uses authored data-state as the uncontrolled initial state', async () => {
  await using component = createModal(template({ state: 'open' }), {})

  expect(component.elements.content.hidden).toBe(false)
})

it('explicit props take precedence over authored modal attributes', async () => {
  await using component = createModal(template({ state: 'open', forceAction: true, ariaLabel: 'Authored label' }), {
    'defaultOpen': false,
    'forceAction': false,
    'aria-label': 'Explicit label',
  })

  expect(component.elements.content.hidden).toBe(true)
  expect(component.elements.content.getAttribute('aria-label')).toBe('Explicit label')
  expect(component.elements.instance.machine.prop('forceAction')).toBe(false)
})
