import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <nav data-scope="dropdown" data-part="root" id="${rootId}">
    <button data-part="trigger" type="button">Languages</button>
    <ul data-part="content">
      <li data-part="item" data-value="english">
        <a href="#english">English</a>
      </li>
    </ul>
  </nav>
`

it('uses the trigger and content ids passed in props', { tags: ['new'] }, async () => {
  await using _component = createDisposableDropdown(rootId, TEMPLATE, { ids: { trigger: 'language-button', content: 'language-options' } })
  const trigger = page.getByRole('button', { name: 'Languages' })

  await expect.element(trigger).toHaveAttribute('id', 'language-button')
  await expect.element(trigger).toHaveAttribute('aria-controls', 'language-options')
})
