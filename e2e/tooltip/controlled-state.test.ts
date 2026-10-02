import { expect, it, vi } from 'vitest'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

it('controlled false takes precedence over defaultOpen and waits for the owner', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using fixture = createDisposableTooltip('controlled', TOOLTIP('controlled'), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })
  const { getTriggerEl, getContentEl, getInstance } = fixture.elements

  expect(getContentEl().getAttribute('data-state')).toBe('closed')
  getTriggerEl().dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: true }))
  expect(getContentEl().getAttribute('data-state')).toBe('closed')

  getInstance()?.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(getContentEl().getAttribute('data-state')).toBe('open'))
  expect(onOpenChange).toHaveBeenCalledOnce()

  getInstance()?.machine.updateProps({ open: undefined })
  await vi.waitFor(() => expect(getContentEl().getAttribute('data-state')).toBe('open'))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('a controlled owner can decline and then accept a close request', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using fixture = createDisposableTooltip('controlled', TOOLTIP('controlled'), {
    open: true,
    onOpenChange,
  })
  const { getRootEl, getContentEl, getInstance } = fixture.elements

  getRootEl().dispatchEvent(new MouseEvent('mouseleave'))
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: false }))
  expect(getContentEl().getAttribute('data-state')).toBe('open')

  getInstance()?.machine.updateProps({ open: false })
  await vi.waitFor(() => expect(getContentEl().getAttribute('data-state')).toBe('closed'))
  expect(onOpenChange).toHaveBeenCalledOnce()
})
