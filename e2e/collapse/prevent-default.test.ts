import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <section data-scope="collapse" data-part="root" id="${rootId}">
    <button data-part="trigger">
      Here's how you know
    </button>
    <div data-part="content">
      <p>Official websites use .gov</p>
      <p>Secure .gov websites use HTTPS</p>
    </div>
  </section>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-banner/src/index.js#L15-L16 (toggleBanner calls event.preventDefault())
it('prevents the default action of a trigger click', { tags: ['parity'] }, async () => {
  await using component = createDisposableCollapse(rootId, TEMPLATE)

  // Bubble phase at the document runs after the trigger's own listener.
  let defaultPrevented = false
  const onClick = (event: Event) => {
    defaultPrevented = event.defaultPrevented
  }
  document.addEventListener('click', onClick)
  using _listener = {
    [Symbol.dispose]: () => document.removeEventListener('click', onClick),
  }

  await userEvent.click(component.elements.getTriggerEl()!)

  expect(defaultPrevented).toBe(true)
  expect(component.elements.getTriggerEl()?.getAttribute('aria-expanded')).toBe('true')
})
