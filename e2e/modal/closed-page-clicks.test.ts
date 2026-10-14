import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableModals, MODAL, TRIGGER } from './_utils.js'

const id = 'test'

// The markup has no stylesheet in these tests. This gives the positioner the vanilla example's layout, which covers the
// viewport whether or not the modal is open.
function exampleLayout() {
  const style = document.createElement('style')
  style.textContent = `[data-part="positioner"] { position: fixed; inset: 0; z-index: 50; }`
  document.head.appendChild(style)
  return { [Symbol.dispose]: () => style.remove() }
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/styles/_usa-modal.scss#L28-L32 (the closed wrapper is hidden, so its full-viewport overlay takes no clicks)
it('a closed modal lets clicks reach the page under it', { tags: ['parity'] }, async () => {
  using _layout = exampleLayout()
  await using _component = createDisposableModals(`
    <button type="button" id="page-button">Page</button>
    ${TRIGGER({ id })}${MODAL({ id })}
  `)
  const pageButton = document.getElementById('page-button')!
  const pageClicks: number[] = []
  pageButton.addEventListener('click', () => pageClicks.push(1))
  const rect = pageButton.getBoundingClientRect()

  // The click goes to the document at the page button's position, where a user's pointer would land.
  await userEvent.click(document.documentElement, { position: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } })

  await expect.poll(() => pageClicks).toEqual([1])
})
