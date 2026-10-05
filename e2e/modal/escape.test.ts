import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L153-L160 (the focus trap binds Escape to close unless the modal forces an action)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L185-L188 (closing returns focus to the opener)
it('escape closes an open modal and returns focus to the opener', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl, getContentEl } = component.elements
  await userEvent.click(getTriggerEl(id)!)
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
  await vi.waitFor(() => expect(getContentEl(id)?.contains(document.activeElement)).toBe(true))

  await userEvent.keyboard('{Escape}')

  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
  await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl(id)))
})
