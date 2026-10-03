import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L360-L391 (each modal is built and bound to its own triggers)
it('sibling modals keep their own controls, open focus and focus return', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`
    ${TRIGGER({ id: 'one' })}${TRIGGER({ id: 'two' })}
    ${MODAL({ id: 'one' })}${MODAL({ id: 'two' })}
  `)
  const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements

  expect(getTriggerEl('one')?.getAttribute('aria-controls')).toBe(getContentEl('one')?.id)
  expect(getTriggerEl('two')?.getAttribute('aria-controls')).toBe(getContentEl('two')?.id)
  expect(getContentEl('one')).not.toBe(getContentEl('two'))

  await userEvent.click(getTriggerEl('one')!)
  expect(getContentEl('one')?.hasAttribute('hidden')).toBeFalsy()
  expect(getContentEl('two')?.hasAttribute('hidden')).toBeTruthy()
  await vi.waitFor(() => expect(getContentEl('one')?.contains(document.activeElement)).toBe(true))

  await userEvent.click(getCloseTriggerEl('one')!)
  expect(getContentEl('one')?.hasAttribute('hidden')).toBeTruthy()
  await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl('one')))

  await userEvent.click(getTriggerEl('two')!)
  expect(getContentEl('two')?.hasAttribute('hidden')).toBeFalsy()
  expect(getContentEl('one')?.hasAttribute('hidden')).toBeTruthy()
  await vi.waitFor(() => expect(getContentEl('two')?.contains(document.activeElement)).toBe(true))

  await userEvent.click(getCloseTriggerEl('two')!)
  expect(getContentEl('two')?.hasAttribute('hidden')).toBeTruthy()
  await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl('two')))
})
