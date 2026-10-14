import { expect, it } from 'vitest'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L256-L260 (the overlay gets aria-controls naming the dialog)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L252-L254 (force action is set on the wrapper, so the overlay still matches CLOSERS)
it('the overlay controls the dialog, with or without force action', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`
    ${TRIGGER({ id: 'one' })}${TRIGGER({ id: 'two' })}
    ${MODAL({ id: 'one' })}${MODAL({ id: 'two', forceAction: true })}
  `)
  const { getPositionerEl, getContentEl } = component.elements

  await expect.element(getPositionerEl('one')!).toHaveAttribute('aria-controls', getContentEl('one')!.id)
  await expect.element(getPositionerEl('two')!).toHaveAttribute('aria-controls', getContentEl('two')!.id)
})
