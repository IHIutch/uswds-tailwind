import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L110-L119 (a click inside the modal that is not on a closer is ignored)
it('a click inside the content that is not a closer leaves the modal open', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl, getContentEl, getTitleEl, getCloseTriggerEl } = component.elements
  await userEvent.click(getTriggerEl(id)!)

  await userEvent.click(getTitleEl(id)!)
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()

  await userEvent.click(document.getElementById(`${id}-continue`)!)
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()

  await userEvent.click(getCloseTriggerEl(id)!)
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
})
