import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDropdown } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <nav data-scope="dropdown" data-part="root" id="${rootId}">
    <button data-part="trigger" type="button">Languages</button>
    <ul data-part="content" style="position: absolute">
      <li data-part="item" data-value="english">
        <a href="#english">English</a>
      </li>
    </ul>
  </nav>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-language-selector/src/index.js#L60 (link activation closes the active menu)
it.each(['pointer', 'keyboard'] as const)('closes the menu and returns focus without preventing link navigation on %s activation', { tags: ['parity'] }, async (activation) => {
  const originalUrl = location.href
  try {
    history.replaceState(null, '', '#before-selection')
    await using component = createDisposableDropdown(rootId, TEMPLATE)
    const { getTriggerEl, getContentEl } = component.elements
    await userEvent.click(getTriggerEl())
    expect(getContentEl()?.hidden).toBe(false)
    const link = getContentEl()!.querySelector<HTMLAnchorElement>('a')!

    if (activation === 'pointer') {
      await userEvent.click(link)
    }
    else {
      link.focus()
      await userEvent.keyboard('{Enter}')
    }

    await vi.waitFor(() => expect(location.hash).toBe('#english'))
    await vi.waitFor(() => expect(getContentEl()?.hidden).toBe(true))
    expect(document.activeElement).toBe(getTriggerEl())
  }
  finally {
    history.replaceState(null, '', originalUrl)
  }
})
