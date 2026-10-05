import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L20 (content the author already hid is left out of the sweep)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L168-L171 (open hides the rest of the page)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L180-L183 (close only restores what the modal itself hid)
it('content the author marked aria-hidden keeps it through open and close', { tags: ['parity'] }, async () => {
  await using component = createDisposableModals(`
    <div id="author-hidden" aria-hidden="true">Hidden by the author</div>
    <div id="page-content">Page content</div>
    ${TRIGGER({ id })}${MODAL({ id })}
  `)
  const { getTriggerEl, getCloseTriggerEl } = component.elements
  const authorHidden = document.getElementById('author-hidden')!
  const pageContent = document.getElementById('page-content')!

  await userEvent.click(getTriggerEl(id)!)
  await vi.waitFor(() => expect(pageContent.getAttribute('aria-hidden')).toBe('true'))
  expect(authorHidden.getAttribute('aria-hidden')).toBe('true')

  await userEvent.click(getCloseTriggerEl(id)!)
  await vi.waitFor(() => expect(pageContent.hasAttribute('aria-hidden')).toBe(false))
  expect(authorHidden.getAttribute('aria-hidden')).toBe('true')
})
