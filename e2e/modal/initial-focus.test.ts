import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L143-L146 (a [data-focus] element is preferred over the footer button and any other button)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L165 (the chosen element is focused on open)
it('focuses a [data-focus] element over an earlier button', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, content: '<button type="button">First</button><input id="focus-me" data-focus />' })}`)
  const { getTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id)!)

  await expect.element(document.getElementById('focus-me')!).toHaveFocus()
})

// With no [data-focus] element and no footer, USWDS falls through to the first enabled button in the modal.
// The footer step in between is left out on purpose: the markup here has no footer part.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L143-L146 (the fallback order: [data-focus], a footer button, then any button)
it('focuses the first enabled button when there is no [data-focus] element', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
  const { getTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id)!)

  await vi.waitFor(() => expect(document.activeElement).toBe(document.getElementById(`${id}-continue`)))
})

// Divergence: USWDS falls back only to buttons, so an input ahead of them is skipped. This follows the APG dialog pattern
// instead, which sets initial focus on the first focusable element. `[data-focus]` still overrides either fallback.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L143-L146
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction
it('focuses the first focusable element, even an input ahead of the buttons', { tags: ['new'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, content: '<input id="early-input" />' })}`)
  const { getTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id)!)

  await expect.element(document.getElementById('early-input')!).toHaveFocus()
})

it('skips a disabled button when choosing the first button', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, content: '<button type="button" id="disabled-button" disabled>Disabled</button>' })}`)
  const { getTriggerEl } = component.elements

  await userEvent.click(getTriggerEl(id)!)

  await vi.waitFor(() => expect(document.activeElement).toBe(document.getElementById(`${id}-continue`)))
})
