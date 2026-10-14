import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableCollapse } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <form>
    <label>Email <input type="email"></label>
    <section data-scope="collapse" data-part="root" id="${rootId}">
      <button data-part="trigger">Here's how you know</button>
      <div data-part="content">
        <p>Official websites use .gov</p>
      </div>
    </section>
    <button>Submit</button>
  </form>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-banner/src/usa-banner.twig#L22 (the trigger is a type="button", so it is never the form's default button)
it('pressing Enter in a form field submits the form without toggling the collapse', { tags: ['parity'] }, async () => {
  await using _component = createDisposableCollapse(rootId, TEMPLATE)
  let submitted = false
  document.querySelector('form')!.addEventListener('submit', (event) => {
    event.preventDefault()
    submitted = true
  })

  await userEvent.click(page.getByRole('textbox', { name: 'Email' }))
  await userEvent.keyboard('{Enter}')

  await expect.poll(() => submitted).toBe(true)
  await expect.element(page.getByRole('button', { name: 'Here\'s how you know' })).toHaveAttribute('aria-expanded', 'false')
})
