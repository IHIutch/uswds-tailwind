import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTooltip, TOOLTIP } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-tooltip/src/index.js#L399-L400 (Escape is handled by the shared USWDS keymap)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/uswds-core/src/js/utils/keymap.js (modified Escape does not match the unmodified shortcut)
for (const modifier of ['Control', 'Shift', 'Alt', 'Meta']) {
  it(`${modifier}+Escape keeps the tooltip open`, { tags: ['parity'] }, async () => {
    await using component = createDisposableTooltip('test', TOOLTIP('test'))
    const { getTriggerEl, getContentEl } = component.elements
    await userEvent.hover(getTriggerEl())
    getTriggerEl().focus()
    expect(getContentEl().getAttribute('aria-hidden')).toBe('false')

    await userEvent.keyboard(`{${modifier}>}{Escape}{/${modifier}}`)

    expect(getContentEl().getAttribute('aria-hidden')).toBe('false')
  })
}
