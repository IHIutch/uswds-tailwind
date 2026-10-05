import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

it('controlled false takes precedence over defaultOpen and waits for the owner', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using fixture = createDisposableTooltip('controlled', TOOLTIP('controlled'), {
    open: false,
    defaultOpen: true,
    onOpenChange,
  })
  const { getTriggerEl, getContentEl, getInstance } = fixture.elements

  expect(getContentEl().getAttribute('aria-hidden')).toBe('true')
  await userEvent.hover(getTriggerEl())
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: true }))
  expect(getContentEl().getAttribute('aria-hidden')).toBe('true')

  getInstance()!.machine.updateProps({ open: true })
  await vi.waitFor(() => expect(getContentEl().getAttribute('aria-hidden')).toBe('false'))
  expect(onOpenChange).toHaveBeenCalledOnce()

  getInstance()!.machine.updateProps({ open: undefined })
  await vi.waitFor(() => expect(getContentEl().getAttribute('aria-hidden')).toBe('false'))
  expect(onOpenChange).toHaveBeenCalledOnce()
})

it('a controlled owner can decline and then accept a close request', { tags: ['new'] }, async () => {
  const onOpenChange = vi.fn()
  await using fixture = createDisposableTooltip('controlled', TOOLTIP('controlled'), {
    open: true,
    onOpenChange,
  })
  const { getTriggerEl, getContentEl, getInstance } = fixture.elements

  await userEvent.hover(getTriggerEl())
  await userEvent.unhover(getTriggerEl())
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: false }))
  expect(getContentEl().getAttribute('aria-hidden')).toBe('false')

  getInstance()!.machine.updateProps({ open: false })
  await vi.waitFor(() => expect(getContentEl().getAttribute('aria-hidden')).toBe('true'))
  expect(onOpenChange).toHaveBeenCalledOnce()
})
