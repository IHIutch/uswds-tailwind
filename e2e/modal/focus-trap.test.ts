import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// The tab stops in MODAL() are the Continue button (first) and the close button (last).
describe('focus trap', { tags: ['parity'] }, () => {
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/focus-trap.js#L16-L21 (tabAhead wraps from the last tab stop to the first)
  it('tab at the last tab stop wraps to the first', async () => {
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)
    await vi.waitFor(() => expect(getContentEl(id)?.contains(document.activeElement)).toBe(true))
    getCloseTriggerEl(id)!.focus()

    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(document.getElementById(`${id}-continue`))
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/focus-trap.js#L23-L27 (tabBack wraps from the first tab stop to the last)
  it('shift+tab at the first tab stop wraps to the last', async () => {
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)
    await vi.waitFor(() => expect(getContentEl(id)?.contains(document.activeElement)).toBe(true))
    document.getElementById(`${id}-continue`)!.focus()

    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')

    expect(document.activeElement).toBe(getCloseTriggerEl(id))
  })
})
