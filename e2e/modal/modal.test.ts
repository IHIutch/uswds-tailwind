import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Combobox, comboboxInit } from '../../packages/compat/src/combobox.js'
import { Modal, modalInit } from '../../packages/compat/src/modal.js'
import { createDisposableModals } from './_utils.js'

const modal1 = 'modal-1'
const modal2 = 'modal-2'
const comboboxId = 'nested-combobox'

const template = `
  <div aria-hidden="true" id="stays-hidden">
    Needs to stay set to aria-hidden="true" when modals are toggled
  </div>

  <div id="other-content"></div>

  <a data-scope="modal" data-part="trigger" data-target="${modal1}">
    Open modal
  </a>
  <button type="button" data-scope="modal" data-part="trigger" data-target="${modal2}">
    Open modal
  </button>

  <!-- Modal 1 -->
  <div data-scope="modal" data-part="root" data-value="${modal1}">
    <div data-part="backdrop"></div>
    <div data-part="positioner">
      <div data-part="content" aria-labelledby="modal-sm-heading-1" aria-describedby="describe-1">
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

          <div data-scope="combobox" data-part="root" id="${comboboxId}">
            <label data-part="label">Combobox label</label>
            <select data-part="hidden-select" name="options">
              <option value="">- Select -</option>
              <option value="value1">Option A</option>
              <option value="value2">Option B</option>
              <option value="value3">Option C</option>
            </select>
            <input data-part="input" />
            <button data-part="trigger" type="button"></button>
            <ul data-part="list"></ul>
          </div>

          <div>
            <ul>
              <li>
                <button type="button" data-part="close-trigger">
                  Continue
                </button>
              </li>
            </ul>
          </div>
        </div>
        <button type="button" data-part="close-trigger">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Modal 2 -->
  <div data-scope="modal" data-part="root" data-value="${modal2}">
    <div data-part="backdrop"></div>
    <div data-part="positioner">
      <div data-part="content">
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
                <button type="button" data-part="close-trigger">
                  Continue
                </button>
              </li>
            </ul>
          </div>
        </div>
        <button type="button" data-part="close-trigger">
          Close
        </button>
      </div>
    </div>
  </div>
`

it('disposes every modal and nested combobox initialized by the setup', { tags: ['new'] }, async () => {
  const destroySpies = []
  {
    await using component = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
    const comboboxRoot = document.querySelector<HTMLElement>('[data-scope="combobox"][data-part="root"]')!
    const instances = [Modal.getInstance(component.elements.getRootEl(modal1)!)!, Modal.getInstance(component.elements.getRootEl(modal2)!)!, Combobox.getInstance(comboboxRoot)!]
    destroySpies.push(...instances.map(instance => vi.spyOn(instance, 'destroy')))
    expect(document.getElementById(`combobox:${comboboxId}:list`)).not.toBeNull()
  }
  for (const destroy of destroySpies)
    expect(destroy).toHaveBeenCalledOnce()
})

it('creates new parent elements', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const content = modal.elements.getContentEl(modal1)
  const backdrop = modal.elements.getBackdropEl(modal1)
  const positioner = modal.elements.getPositionerEl(modal1)

  expect(content).toBeTruthy()
  expect(backdrop).toBeTruthy()
  expect(positioner).toBeTruthy()
})

it('adds role="dialog" to modal content', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('role')).toBe('dialog')
})

it('keeps aria-labelledby, aria-describedby on the content', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('aria-describedby')).toBe(`modal:${modal1}:description`)
  expect(content.getAttribute('aria-labelledby')).toBe(`modal:${modal1}:title`)
})

it('sets tabindex="-1" to the modal content', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const content = modal.elements.getContentEl(modal1)!
  expect(content.getAttribute('tabindex')).toBe('-1')
})

// TODO: Fix this test. See comment in ./packages/compat/src/modal.ts
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L320 (the built modal is appended to the body)
it('moves the modal to the bottom of the DOM', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const root = modal.elements.getRootEl(modal2)!
  expect(document.body.lastElementChild).toBe(root)
  expect(document.body.contains(modal.elements.getTriggerEl(modal2))).toBe(true)
})

// Divergence: USWDS adds role="button" to <a> openers only. <buttons> have role="button" implicitly, so this is functionally the same
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L373-L376
it('adds role="button" to any <a> opener', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const trigger2 = modal.elements.getTriggerEl(modal2)!

  expect(trigger1.getAttribute('role')).toBe('button')
  expect(trigger2.getAttribute('role')).toBe('button')
})

it('adds aria-controls to each opener', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const trigger2 = modal.elements.getTriggerEl(modal2)!

  const content1 = modal.elements.getContentEl(modal1)!
  const content2 = modal.elements.getContentEl(modal2)!

  expect(content1.id).toBe(`modal:${modal1}:content`)
  expect(content2.id).toBe(`modal:${modal2}:content`)
  expect(trigger1.getAttribute('aria-controls')).toBe(`modal:${modal1}:content`)
  expect(trigger2.getAttribute('aria-controls')).toBe(`modal:${modal2}:content`)
})

it('makes the modal visible', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const content1 = modal.elements.getContentEl(modal1)!

  await userEvent.click(trigger1)
  expect(content1.getAttribute('hidden')).toBeFalsy()
})

// 3.14 focuses a [data-focus] element, else the first enabled footer button, else the first enabled button. There is
// no footer part here, so the first enabled button is the target. Modal 2 has no combobox, so that is its Continue button.
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L143-L146 (the initial focus fallback order)
it('focuses the first button when opened', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const firstButton = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)

  await vi.waitFor(() => expect(document.activeElement).toBe(firstButton))
})

it('makes all other page content invisible to screen readers', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const positioner1 = modal.elements.getPositionerEl(modal1)!

  await userEvent.click(trigger1)

  await vi.waitFor(() => {
    const activeContent = Array.from(document.querySelectorAll('body > :not([aria-hidden])'))
    expect(activeContent.length).toBe(1)
    expect(activeContent[0]).toContain(positioner1)
  })
})

it('allows event propagation and displays combobox list when toggle is clicked', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger1 = modal.elements.getTriggerEl(modal1)!
  const comboboxTrigger = document.getElementById(`combobox:${comboboxId}:trigger`)!
  const comboboxList = document.getElementById(`combobox:${comboboxId}:list`)!

  await userEvent.click(trigger1)
  await userEvent.click(comboboxTrigger)

  expect(comboboxList.hasAttribute('hidden')).toBeFalsy()
})

it('hides the modal when close button is clicked', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])

  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!
  const content2 = modal.elements.getContentEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  expect(content2.hasAttribute('hidden')).toBeTruthy()
})

it('closes the modal when the overlay is clicked', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const content2 = modal.elements.getContentEl(modal2)!

  await userEvent.click(trigger2)
  // The page under an open modal receives no pointer events, so a click on the scrim lands on the document.
  // Stay off the frame's left edge: the vitest runner's pane splitter sits over it and takes the click.
  await userEvent.click(document.documentElement, { position: { x: innerWidth / 2, y: 5 } })
  await vi.waitFor(() => expect(content2.hasAttribute('hidden')).toBeTruthy())
})

it('sends focus to the element that opened it', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  const activeEl = document.activeElement
  expect(activeEl === trigger2).toBeTruthy()
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-modal/src/index.js#L176-L183 (restore runs whether or not the opener still exists)
it('restores page content when the opener has left the document', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)
  await vi.waitFor(() => expect(document.getElementById('other-content')?.getAttribute('aria-hidden')).toBe('true'))
  // The view holding the opener re-renders while the modal is open, so the opener is gone by the time we close.
  trigger2.remove()

  await userEvent.click(closeTrigger2)

  await vi.waitFor(() => expect(document.getElementById('other-content')?.hasAttribute('aria-hidden')).toBe(false))
  expect(document.getElementById('stays-hidden')?.hasAttribute('aria-hidden')).toBe(true)
})

it('restores other page content screen reader visibility', { tags: ['legacy'] }, async () => {
  await using modal = createDisposableModals(template, () => [...modalInit(), ...comboboxInit()])
  const trigger2 = modal.elements.getTriggerEl(modal2)!
  const closeTrigger2 = modal.elements.getCloseTriggerEl(modal2)!

  await userEvent.click(trigger2)
  await userEvent.click(closeTrigger2)
  const activeContent = document.querySelectorAll('body > :not([aria-hidden])')
  const staysHidden = document.getElementById('stays-hidden')
  expect(activeContent.length).toBe(5)
  expect(staysHidden?.hasAttribute('aria-hidden')).toBeTruthy()
  expect(document.getElementById('other-content')?.hasAttribute('aria-hidden')).toBeFalsy()
})
