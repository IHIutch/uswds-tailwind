import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { Collapse, collapseInit } from '../../packages/compat/src/collapse.js'

const TEMPLATE = `
  <section data-part="collapse-root">
    <button data-part="collapse-trigger">
      Here's how you know
    </button>
    <div data-part="collapse-content">
      <p>Official websites use .gov</p>
      <p>Secure .gov websites use HTTPS</p>
    </div>
  </section>
`

describe('collapse', () => {
  // let collapseId: string
  let root: HTMLElement
  let button: HTMLElement
  let content: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    collapseInit()

    root = document.querySelector('[data-part="collapse-root"]')!
    button = root.querySelector('[data-part="collapse-trigger"]')!
    content = root.querySelector('[data-part="collapse-content"]')!
    // collapseId = root.id.split(':')[1]
  })

  it('initializes closed', () => {
    expect(root.getAttribute('data-state')).toBe('closed')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(content.hasAttribute('hidden')).toBeTruthy()
  })

  it('opens when you click the button', async () => {
    await userEvent.click(button)

    expect(root.getAttribute('data-state')).toBe('open')
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(content.hasAttribute('hidden')).toBeFalsy()
  })

  it('closes when you click the button again', async () => {
    await userEvent.click(button)
    await userEvent.click(button)

    expect(root.getAttribute('data-state')).toBe('closed')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(content.hasAttribute('hidden')).toBeTruthy()
  })
})
