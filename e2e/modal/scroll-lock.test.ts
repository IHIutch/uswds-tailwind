import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// USWDS locks the page with the usa-js-modal--active body class (overflow: hidden in its stylesheet) plus
// scrollbar-width padding. Here the body is locked directly, and its original inline style comes back on close.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L122 (the body is marked active while a modal is open)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L135-L139 (body padding makes up for the missing scrollbar)
it('locks body scroll while open and restores the original style on close', { tags: ['parity'] }, async () => {
  document.body.style.overflow = 'auto'
  using _style = { [Symbol.dispose]: () => document.body.style.removeProperty('overflow') }
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl, getCloseTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id)!)
  await vi.waitFor(() => expect(getComputedStyle(document.body).overflow).toBe('hidden'))

  await userEvent.click(getCloseTriggerEl(id)!)
  await vi.waitFor(() => expect(document.body.style.overflow).toBe('auto'))
})
