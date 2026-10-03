import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// The markup has no stylesheet in these tests, which leaves the overlay with no height. This gives it the full
// viewport, like the USWDS overlay. While the modal is open the page under it receives no pointer events, so a
// click on the scrim lands on the document itself; the tests click the document at a point on the scrim.
function overlayLayout() {
  const style = document.createElement('style')
  style.textContent = `
    [data-part="backdrop"][data-state="open"] { position: fixed; inset: 0; }
    [data-part="positioner"] { position: fixed; top: 40%; left: 40%; z-index: 1; }
  `
  document.head.appendChild(style)
  return { [Symbol.dispose]: () => style.remove() }
}

describe('force action', { tags: ['parity'] }, () => {
  // USWDS adds the usa-js-no-click class to the body, whose stylesheet rule turns pointer events off under the overlay.
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L129-L131 (a force-action modal marks the body no-click)
  it('page controls cannot be clicked while open, but can again after close', async () => {
    using _layout = overlayLayout()
    await using component = createDisposableModals(`
      <button type="button" id="page-button" style="position: fixed; bottom: 0; right: 0;">Page</button>
      ${TRIGGER({ id })}${MODAL({ id, forceAction: true })}
    `)
    const { getTriggerEl, getCloseTriggerEl } = component.elements
    const pageButton = document.getElementById('page-button')!
    const pageClicks: number[] = []
    pageButton.addEventListener('click', () => pageClicks.push(1))
    const rect = pageButton.getBoundingClientRect()

    await userEvent.click(getTriggerEl(id)!)
    // The click goes to the document at the page button's position, where a user's pointer would land.
    const atPageButton = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    await userEvent.click(document.documentElement, { position: atPageButton })
    expect(pageClicks).toEqual([])

    await userEvent.click(getCloseTriggerEl(id)!)
    await userEvent.click(pageButton)
    expect(pageClicks).toEqual([1])
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L153-L154 (the focus trap is built without an Escape binding)
  it('escape leaves the modal open', async () => {
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, forceAction: true })}`)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)
    await vi.waitFor(() => expect(getContentEl(id)?.contains(document.activeElement)).toBe(true))

    await userEvent.keyboard('{Escape}')

    // Bounded by the close button, which must be the first thing that closes it.
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
    await userEvent.click(getCloseTriggerEl(id)!)
    expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L19 (the overlay is only a closer when the modal has no data-force-action)
  it('a pointer click on the overlay leaves the modal open', async () => {
    using _layout = overlayLayout()
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, forceAction: true })}`)
    const { getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)

    // Stay off the frame's left edge: the vitest runner's pane splitter sits over it and takes the click.
    await userEvent.click(document.documentElement, { position: { x: innerWidth / 2, y: 5 } })

    expect(getContentEl(id)?.hasAttribute('hidden')).toBeFalsy()
  })

  // The same click on a modal without force action closes it, so the test above is not passing by accident.
  it('the same pointer click closes a modal without force action', async () => {
    using _layout = overlayLayout()
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id })}`)
    const { getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)

    await userEvent.click(document.documentElement, { position: { x: innerWidth / 2, y: 5 } })

    await vi.waitFor(() => expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy())
  })

  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L19 (the close button is always a closer)
  // https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L185-L188 (closing returns focus to the opener)
  it('the close button still closes and returns focus to the opener', async () => {
    await using component = createDisposableModals(`${TRIGGER({ id })}${MODAL({ id, forceAction: true })}`)
    const { getTriggerEl, getContentEl, getCloseTriggerEl } = component.elements
    await userEvent.click(getTriggerEl(id)!)

    await userEvent.click(getCloseTriggerEl(id)!)

    expect(getContentEl(id)?.hasAttribute('hidden')).toBeTruthy()
    await vi.waitFor(() => expect(document.activeElement).toBe(getTriggerEl(id)))
  })
})
