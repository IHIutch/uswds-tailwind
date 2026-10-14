import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L97-L105 (the clicked opener is remembered on the modal)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L185-L188 (closing returns focus to that opener)
it('closing returns focus to whichever of two triggers opened the modal', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl, getCloseTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id, 1)!)
  await userEvent.click(getCloseTriggerEl(id)!)

  await expect.element(getTriggerEl(id, 1)!).toHaveFocus()
})
