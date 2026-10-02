import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// destroy() stands in for the USWDS modal.off().
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L392-L402 (teardown stops the triggers from toggling the modal)
it('after destroy, trigger clicks and escape do nothing', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`<input id="page-input" />${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl, getContentEl, getInstance } = component.elements
  await userEvent.click(getTriggerEl(id)!)
  await userEvent.keyboard('{Escape}')
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()

  getInstance(id)!.destroy()

  await userEvent.click(getTriggerEl(id)!)
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
  expect(document.body.hasAttribute('data-modal-active')).toBe(false)

  // The page is left usable: a page control takes focus and typing, and Escape is not swallowed.
  await userEvent.click(document.getElementById('page-input')!)
  await userEvent.keyboard('a{Escape}b')
  expect((document.getElementById('page-input') as HTMLInputElement).value).toBe('ab')
  expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
})
