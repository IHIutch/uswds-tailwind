import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

function TEMPLATE(linkStyle = '') {
  return `
    <nav data-scope="dropdown" data-part="root" id="${rootId}">
      <button data-part="trigger" type="button">Languages</button>
      <ul data-part="content">
        <li data-part="item" data-value="english">
          <a href="#english" style="${linkStyle}">English</a>
        </li>
      </ul>
    </nav>
  `
}

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/index.js#L29-L40 (Escape hides the menu and focuses the language button)
it('escape from a link closes the menu and focuses the trigger', { tags: ['parity'] }, async () => {
  await using _component = createDisposableDropdown(rootId, TEMPLATE())
  const trigger = page.getByRole('button', { name: 'Languages' })

  await userEvent.click(trigger)
  page.getByRole('link', { name: 'English' }).element().focus()
  await userEvent.keyboard('{Escape}')

  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect.element(trigger).toHaveFocus()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/index.js#L33 (focus() scrolls the button into view)
it('escape scrolls the trigger back into view', { tags: ['parity'] }, async () => {
  await using _component = createDisposableDropdown(rootId, `${TEMPLATE('display: block; margin-top: 300vh')}<div style="height: 400vh"></div>`)
  const trigger = page.getByRole('button', { name: 'Languages' })

  await userEvent.click(trigger)
  page.getByRole('link', { name: 'English' }).element().focus()
  await expect.element(trigger).not.toBeInViewport()
  await userEvent.keyboard('{Escape}')

  await expect.element(trigger).toHaveFocus()
  await expect.element(trigger).toBeInViewport()
})
