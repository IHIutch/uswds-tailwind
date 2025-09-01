import { page, userEvent } from '@vitest/browser/context'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'
import { Modal, modalInit } from '../../packages/compat/src/modal.js'

describe('modal', () => {
  let positionerEl1: HTMLElement
  let positionerEl2: HTMLElement
  let triggerEl1: HTMLElement
  let triggerEl2: HTMLElement
  let backdropEl1: HTMLElement
  let backdropEl2: HTMLElement
  let contentEl1: HTMLElement
  let contentEl2: HTMLElement
  let closeTriggerEl2: HTMLElement
  let comboboxToggleEl: HTMLElement
  let comboboxListEl: HTMLElement

  const template = `
  <div aria-hidden="true" id="stays-hidden">
    Needs to stay set to aria-hidden="true" when modals are toggled
  </div>

  <div id="other-content"></div>

  <a id="open-button1" data-part="modal-trigger" data-target="modal-1">
    Open modal
  </a>
  <button id="open-button2" type="button" data-part="modal-trigger" data-target="modal-2">
    Open modal
  </button>

  <!-- Modal 1 -->
  <div data-part="modal-backdrop" data-value="modal-1" style="position: fixed; inset: 0; background:red; z-index: 1;"></div>
  <div data-part="modal-positioner" data-value="modal-1" style="position: relative; z-index: 2;">
    <div data-part="modal-content" aria-labelledby="modal-sm-heading-1" aria-describedby="describe-1">
      <div>
        <h2 id="modal-sm-heading-1">
          You have unsaved changes
        </h2>
        <div id="describe-1">
          <p>
            Your changes will be lost if you leave this page without saving. Are
            you sure you want to continue?
          </p>
        </div>

        <label for="nestedCB" data-part="combobox-label">Combobox label</label>
        <div data-part="combobox-root" id="nestedCB">
          <select data-part="combobox-select" name="options">
            <option value="">- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
          </select>
          <input data-part="combobox-input" />
          <button data-part="combobox-toggle" type="button"></button>
          <ul data-part="combobox-list"></ul>
        </div>

        <div>
          <ul>
            <li>
              <button type="button" data-part="modal-close-trigger">
                Continue
              </button>
            </li>
          </ul>
        </div>
      </div>
      <button type="button" data-part="modal-close-trigger">
        Close
      </button>
    </div>
  </div>

  <!-- Modal 2 -->
  <div data-part="modal-backdrop" data-value="modal-2" style="position: fixed; inset: 0; background:green; z-index: 1;"></div>
  <div data-part="modal-positioner" data-value="modal-2" style="position:relative; z-index: 2;">
    <div data-part="modal-content" aria-labelledby="modal-sm-heading-2" aria-describedby="describe-2">
      <div>
        <h2 id="modal-sm-heading-2">
          You have unsaved changes
        </h2>
        <div id="describe-2">
          <p>
            Your changes will be lost if you leave this page without saving. Are
            you sure you want to continue?
          </p>
        </div>

        <div>
          <ul>
            <li>
              <button type="button" data-part="modal-close-trigger">
                Continue
              </button>
            </li>
          </ul>
        </div>
      </div>
      <button type="button" data-part="modal-close-trigger">
        Close
      </button>
    </div>
  </div>
`

  beforeEach(() => {
    document.body.innerHTML = template
    modalInit()
    comboboxInit()

    triggerEl1 = document.querySelector('[data-part="modal-trigger"][data-target="modal-1"]')!
    positionerEl1 = document.querySelector('[data-part="modal-positioner"][data-value="modal-1"]')!
    backdropEl1 = document.querySelector('[data-part="modal-backdrop"][data-value="modal-1"]')!

    triggerEl2 = document.querySelector('[data-part="modal-trigger"][data-target="modal-2"]')!
    positionerEl2 = document.querySelector('[data-part="modal-positioner"][data-value="modal-2"]')!
    backdropEl2 = document.querySelector('[data-part="modal-backdrop"][data-value="modal-2"]')!
    contentEl1 = positionerEl1.querySelector('[data-part="modal-content"]')!
    contentEl2 = positionerEl2.querySelector('[data-part="modal-content"]')!
    closeTriggerEl2 = positionerEl2.querySelector('[data-part="modal-close-trigger"]')!

    comboboxToggleEl = document.querySelector('[data-part="combobox-toggle"]')!
    comboboxListEl = document.querySelector('[data-part="combobox-list"]')!
  })

  describe('builds the modal HTML', () => {
    it('creates new parent elements', () => {
      expect(contentEl1).toBeTruthy()
      expect(backdropEl1).toBeTruthy()
      expect(positionerEl1).toBeTruthy()
    })

    it('adds role="dialog" to modal content', () => {
      expect(contentEl1.getAttribute('role')).toBe('dialog')
    })

    it('keeps aria-labelledby, aria-describedby on the content', () => {
      expect(contentEl1.getAttribute('aria-describedby')).toBe('describe-1')
      expect(contentEl1.getAttribute('aria-labelledby')).toBe('modal-sm-heading-1')
    })

    it('sets tabindex="-1" to the modal content', () => {
      expect(contentEl1.getAttribute('tabindex')).toBe('-1')
    })

    it('moves the modal to the bottom of the DOM', () => {
      expect(document.body.lastElementChild?.getAttribute('data-part')).toBe('modal-backdrop')
    })

    it('adds role="button" to any <a> opener, but not <button>', () => {
      expect(triggerEl1.getAttribute('role')).toBe('button')
      expect(triggerEl2.getAttribute('role')).toBeFalsy()
    })

    it('adds aria-controls to each opener', () => {
      expect(triggerEl1.getAttribute('aria-controls')).toBe(contentEl1.id)
      expect(triggerEl2.getAttribute('aria-controls')).toBe(contentEl2.id)
    })
  })

  describe('when opened', () => {
    beforeEach(async () => {
      await userEvent.click(triggerEl1)
    })

    afterEach(async () => {
      Modal.instances.forEach(modal => modal.close())
    })

    it('makes the modal visible', () => {
      expect(contentEl1.getAttribute('hidden')).toBeFalsy()
    })

    it('focuses the modal content when opened', () => {
      const activeEl = document.activeElement
      expect(activeEl).toBe(contentEl1)
    })

    it('makes all other page content invisible to screen readers', () => {
      const activeContent = Array.from(document.querySelectorAll('body > :not([aria-hidden])'))
      expect(activeContent.length).toBe(2)
      expect(activeContent).toContain(positionerEl1)
      expect(activeContent).toContain(backdropEl1)
    })

    it('allows event propagation and displays combobox list when toggle is clicked', async () => {
      await userEvent.click(comboboxToggleEl)

      expect(comboboxListEl.hasAttribute('hidden')).toBeFalsy()
    })
  })

  describe('when closing', () => {
    beforeEach(async () => {
      await userEvent.click(triggerEl2)
    })

    afterEach(async () => {
      Modal.instances.forEach(modal => modal.close())
    })

    it('hides the modal when close button is clicked', async () => {
      await userEvent.click(closeTriggerEl2)
      expect(contentEl2.getAttribute('hidden')).toBeTruthy()
    })

    it('closes the modal when the overlay is clicked', async () => {
      await userEvent.click(backdropEl2, { force: true, position: { x: 0, y: 0 } })
      expect(contentEl2.getAttribute('hidden')).toBeTruthy()
    })

    it('sends focus to the element that opened it', async () => {
      await userEvent.click(closeTriggerEl2)
      const activeEl = document.activeElement
      expect(activeEl === triggerEl2).toBeTruthy()
    })

    it('restores other page content screen reader visibility', async () => {
      await userEvent.click(closeTriggerEl2)
      const activeContent = document.querySelectorAll('body > :not([aria-hidden])')
      const staysHidden = document.getElementById('stays-hidden')
      expect(activeContent.length).toBe(7)
      expect(staysHidden?.hasAttribute('aria-hidden')).toBeTruthy()
      expect(document.getElementById('other-content')?.hasAttribute('aria-hidden')).toBeFalsy()
    })
  })
})
