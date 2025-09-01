import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { Accordion, accordionInit } from '../../packages/compat/src/accordion.js'

const TEMPLATE = `
    <ul data-part="accordion-root">
      <li data-part="accordion-item" data-value="item-1">
        <button data-part="accordion-trigger">
          Section one
        </button>
        <div data-part="accordion-content"></div>
      </li>
      <li data-part="accordion-item" data-value="item-2">
        <button data-part="accordion-trigger">
          Section two
        </button>
        <div data-part="accordion-content"></div>
      </li>
    </ul>
  `

describe('accordion', () => {
  let accordionId: string
  let root: HTMLElement
  let button: HTMLElement
  let buttons: NodeListOf<HTMLElement>
  let content: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    accordionInit()

    root = document.querySelector('[data-part="accordion-root"]')!
    buttons = root.querySelectorAll('[data-part="accordion-trigger"]')
    button = buttons[0]
    content = document.getElementById(button.getAttribute('aria-controls')!)!
    accordionId = root.id.split(':')[1]
  })

  describe('dom state', () => {
    it('has an "aria-expanded" attribute', () => {
      expect(button.getAttribute('aria-expanded')).toBeTruthy()
    })

    it('has an "aria-controls" attribute', () => {
      expect(button.getAttribute('aria-controls')).toBeTruthy()
    })
  })

  describe('accordion.show()', () => {
    it('toggles button aria-expanded="true"', async () => {
      const instance = Accordion.getInstance(accordionId)
      await instance?.open('item-1')

      expect(button.getAttribute('aria-expanded')).toBe('true')
    })

    it('toggles content "hidden" off', async () => {
      const instance = Accordion.getInstance(accordionId)
      await instance?.open('item-1')

      expect(content.hasAttribute('hidden')).toBeFalsy()
    })
  })

  describe('accordion.hide()', () => {
    it('toggles button aria-expanded="false"', async () => {
      const instance = Accordion.getInstance(accordionId)
      await instance?.close('item-1')

      expect(button.getAttribute('aria-expanded')).toBe('false')
    })

    it('toggles content "hidden" on', async () => {
      const instance = Accordion.getInstance(accordionId)
      await instance?.close('item-1')

      expect(content.hasAttribute('hidden')).toBeTruthy()
    })
  })

  describe('interaction', () => {
    it('shows the second item when clicked', async () => {
      const second = buttons[1]
      const target = document.getElementById(second.getAttribute('aria-controls')!)!

      await userEvent.click(second)

      // first button and section should be collapsed
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(content.hasAttribute('hidden')).toBeTruthy()
      // second should be expanded
      expect(second.getAttribute('aria-expanded')).toBe('true')
      expect(target.hasAttribute('hidden')).toBeFalsy()
    })

    it('keeps multiple sections open with data-allow-multiple', async () => {
      // Re-initialize with multiple attribute
      document.body.innerHTML = ''
      const multipleTemplate = TEMPLATE.replace('data-part="accordion-root"', 'data-part="accordion-root" data-multiple')
      document.body.innerHTML = multipleTemplate
      accordionInit()

      const multiRoot = document.querySelector('[data-part="accordion-root"]')!
      const multiButtons = multiRoot.querySelectorAll('[data-part="accordion-trigger"]')
      const multiButton = multiButtons[0]
      const multiContent = document.getElementById(multiButton.getAttribute('aria-controls')!)!

      const second = multiButtons[1]
      const target = document.getElementById(second.getAttribute('aria-controls')!)!

      await userEvent.click(second)
      await userEvent.click(multiButton)

      expect(multiButton.getAttribute('aria-expanded')).toBe('true')
      expect(multiContent.hasAttribute('hidden')).toBeFalsy()
      // second should be expanded
      expect(second.getAttribute('aria-expanded')).toBe('true')
      expect(target.hasAttribute('hidden')).toBeFalsy()
    })
  })
})
