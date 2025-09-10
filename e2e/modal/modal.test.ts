import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { comboboxInit } from '../../packages/compat/src/combobox.js'
import { modalInit } from '../../packages/compat/src/modal.js'
import { createDisposableComponent } from '../_utils.js'

const modal1 = 'modal-1'
const modal2 = 'modal-2'
const comboboxId = 'nested-combobox'

function createDisposableModalSetup(template: string) {
  return createDisposableComponent(
    template,
    () => {
      modalInit()
      comboboxInit()
    },
    () => {
      const getPositionerEl = (id: string) => document.getElementById(`modal:${id}:positioner`)
      const getBackdropEl = (id: string) => document.getElementById(`modal:${id}:backdrop`)
      const getContentEl = (id: string) => document.getElementById(`modal:${id}:content`)
      const getTriggerEl = (id: string) => document.getElementById(`modal:${id}:trigger`)
      const getCloseTriggerEl = (id: string) => document.getElementById(`modal:${id}:close`)

      const getComboboxTriggerEl = () => document.getElementById(`combobox:${comboboxId}:toggle-button`) as HTMLButtonElement
      const getComboboxListEl = () => document.getElementById(`combobox:${comboboxId}:list`) as HTMLUListElement

      return {
        getTriggerEl,
        getPositionerEl,
        getBackdropEl,
        getContentEl,
        getCloseTriggerEl,
        getComboboxTriggerEl,
        getComboboxListEl,
      }
    },
  )
}

const template = `
  <div aria-hidden="true" id="stays-hidden">
    Needs to stay set to aria-hidden="true" when modals are toggled
  </div>

  <div id="other-content"></div>

  <a data-part="modal-trigger" id="${modal1}" data-target="${modal1}">
    Open modal
  </a>
  <button type="button" data-part="modal-trigger" id="${modal2}" data-target="${modal2}">
    Open modal
  </button>

  <!-- Modal 1 -->
  <div data-part="modal-backdrop" data-value="${modal1}"></div>
  <div data-part="modal-positioner" data-value="${modal1}">
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

        <label for="${comboboxId}" data-part="combobox-label">Combobox label</label>
        <div data-part="combobox-root" id="${comboboxId}">
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
  <div data-part="modal-backdrop" data-value="${modal2}"></div>
  <div data-part="modal-positioner" data-value="${modal2}">
    <div data-part="modal-content">
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

it('creates new parent elements', () => {
  using modal = createDisposableModalSetup(template)
  const content = modal.elements.getContentEl(modal1)
  const backdrop = modal.elements.getBackdropEl(modal1)
  const positioner = modal.elements.getPositionerEl(modal1)

  expect(content).toBeTruthy()
  expect(backdrop).toBeTruthy()
  expect(positioner).toBeTruthy()
})

it('adds role="dialog" to modal content', () => {
  using modal = createDisposableModalSetup(template)
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('role')).toBe('dialog')
})

it('keeps aria-labelledby, aria-describedby on the content', () => {
  using modal = createDisposableModalSetup(template)
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('aria-describedby')).toBe('describe-1')
  expect(content.getAttribute('aria-labelledby')).toBe('modal-sm-heading-1')
})

it('sets tabindex="-1" to the modal content', () => {
  using modal = createDisposableModalSetup(template)
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('tabindex')).toBe('-1')
})

it('moves the modal to the bottom of the DOM', () => {
  using modal = createDisposableModalSetup(template)
  const backdrop = modal.elements.getBackdropEl(modal2)!
  expect(document.body.lastElementChild).toBe(backdrop)
})

it('adds role="button" to any <a> opener, but not <button>', () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const trigger2 = modal.elements.getTriggerEl(modal2)!

  expect(trigger1.getAttribute('role')).toBe('button')
  expect(trigger2.getAttribute('role')).toBeFalsy()
})

it('adds aria-controls to each opener', () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const trigger2 = modal.elements.getTriggerEl(modal2)!

  const content1 = modal.elements.getContentEl(modal1)!
  const content2 = modal.elements.getContentEl(modal2)!

  expect(content1.id).toBe(`modal:${modal1}:content`)
  expect(content2.id).toBe(`modal:${modal2}:content`)
  expect(trigger1.getAttribute('aria-controls')).toBe(`modal:${modal1}:content`)
  expect(trigger2.getAttribute('aria-controls')).toBe(`modal:${modal2}:content`)
})

it('makes the modal visible', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const content1 = modal.elements.getContentEl(modal1)!

  await userEvent.click(trigger1)
  expect(content1.getAttribute('hidden')).toBeFalsy()
})

it('focuses the modal content when opened', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const content1 = modal.elements.getContentEl(modal1)!

  await userEvent.click(trigger1)

  const activeEl = document.activeElement
  expect(activeEl).toBe(content1)
})

it('makes all other page content invisible to screen readers', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const positioner1 = modal.elements.getPositionerEl(modal1)!

  await userEvent.click(trigger1)

  const activeContent = Array.from(document.querySelectorAll('body > :not([aria-hidden])'))
  expect(activeContent.length).toBe(1)
  expect(activeContent[0]).toContain(positioner1)
})

it('allows event propagation and displays combobox list when toggle is clicked', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const comboboxTrigger = modal.elements.getComboboxTriggerEl()!
  const comboboxList = modal.elements.getComboboxListEl()!

  await userEvent.click(trigger1)
  await userEvent.click(comboboxTrigger)

  expect(comboboxList.hasAttribute('hidden')).toBeFalsy()
})

it('hides the modal when close button is clicked', async () => {
  using modal = createDisposableModalSetup(template)

  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!
  const content2 = modal.elements.getContentEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  expect(content2.getAttribute('hidden')).toBeTruthy()
})

it('closes the modal when the overlay is clicked', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const backdrop2 = modal.elements.getBackdropEl(modal2)!
  const content2 = modal.elements.getContentEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(backdrop2, { force: true, position: { x: 0, y: 0 } })
  expect(content2.getAttribute('hidden')).toBeTruthy()
})

it('sends focus to the element that opened it', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  const activeEl = document.activeElement
  expect(activeEl === trigger2).toBeTruthy()
})

it('restores other page content screen reader visibility', async () => {
  using modal = createDisposableModalSetup(template)
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  const activeContent = document.querySelectorAll('body > :not([aria-hidden])')
  const staysHidden = document.getElementById('stays-hidden')
  expect(activeContent.length).toBe(7)
  expect(staysHidden?.hasAttribute('aria-hidden')).toBeTruthy()
  expect(document.getElementById('other-content')?.hasAttribute('aria-hidden')).toBeFalsy()
})
