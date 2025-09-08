import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { dropdownInit } from '../../packages/compat/src/dropdown.js'

describe('dropdown (language selector)', () => {
  let dropdownId: string
  let languageButton: HTMLElement
  let languageList: HTMLElement

  const template = `
    <nav data-part="dropdown-root" id="dropdown-test" class="usa-language">
      <button data-part="dropdown-trigger" type="button" class="usa-accordion__button usa-language__link">
        <span>Languages</span>
      </button>
      <ul data-part="dropdown-content" class="usa-language__submenu" id="language-options">
        <li data-part="dropdown-item" data-value="english">
          <a href="javascript:void(0)" class="usa-language__link">English</a>
        </li>
        <li data-part="dropdown-item" data-value="spanish">
          <a href="javascript:void(0)" class="usa-language__link">Español</a>
        </li>
        <li data-part="dropdown-item" data-value="french">
          <a href="javascript:void(0)" class="usa-language__link">Français</a>
        </li>
      </ul>
    </nav>
  `

  beforeEach(() => {
    document.body.innerHTML = template
    dropdownInit()

    const rootEl = document.querySelector('[data-part="dropdown-root"]')!
    dropdownId = rootEl.id.split(':')[1]
    languageButton = document.querySelector('[data-part="dropdown-trigger"]')!
    languageList = document.querySelector('[data-part="dropdown-content"]')!
  })

  it('shows the language dropdown when the language button is clicked', async () => {
    await userEvent.click(languageButton)
    expect(languageList.getAttribute('hidden')).toBe(null)
  })

  it('hides the visible language menu when the body is clicked', async () => {
    await userEvent.click(languageButton)
    expect(languageList.getAttribute('hidden')).toBe(null)

    await userEvent.click(document.body, { position: { x: 0, y: 0 } })
    expect(languageList.hasAttribute('hidden')).toBe(true)
  })

  it('collapses dropdown when a language link is clicked', async () => {
    const languageLink = document.querySelector('[data-part="dropdown-item"] a')!

    await userEvent.click(languageButton)
    expect(languageButton.getAttribute('aria-expanded')).toBe('true')

    await userEvent.click(languageLink)
    expect(languageButton.getAttribute('aria-expanded')).toBe('false')
  })

  it('collapses dropdown when the Escape key is hit', async () => {
    await userEvent.click(languageButton)
    expect(languageButton.getAttribute('aria-expanded')).toBe('true')

    await userEvent.keyboard('{Escape}')
    expect(languageButton.getAttribute('aria-expanded')).toBe('false')
  })

  it('contains a role of button', () => {
    expect(languageButton.getAttribute('role')).toBe('button')
  })

  it('contains aria-controls of language-options', () => {
    expect(languageButton.getAttribute('aria-controls')).toBe(`dropdown:${dropdownId}:content`)
  })

  it('contains an id of language-options', () => {
    expect(languageList.getAttribute('id')).toBe(`dropdown:${dropdownId}:content`)
  })
})
