import { Modal, modalInit } from '../../packages/compat/src/modal'
import { createDisposableComponent } from '../_utils'

export function createDisposableModal(id: string, template: string) {
  return createDisposableComponent(
    template,
    modalInit,
    () => {
      const getPositionerEl = () => document.getElementById(`modal:${id}:positioner`)
      const getBackdropEl = () => document.getElementById(`modal:${id}:backdrop`)
      const getContentEl = () => document.getElementById(`modal:${id}:content`)
      const getTriggerEl = ({ index = 0 }) => document.getElementById(`modal:${id}:trigger:${index}`)
      const getCloseTriggerEl = ({ index = 0 } = {}) => document.getElementById(`modal:${id}:close:${index}`)

      return {
        getPositionerEl,
        getBackdropEl,
        getContentEl,
        getTriggerEl,
        getCloseTriggerEl,
      }
    },
  )
}

// Getters take the modal's data-value, so one test can address several modals.
export function createDisposableModals(template: string) {
  return createDisposableComponent(
    template,
    modalInit,
    () => {
      const getRootEl = (id: string) => document.querySelector<HTMLElement>(`[data-scope="modal"][data-part="root"][data-value="${id}"]`)
      const getPositionerEl = (id: string) => document.getElementById(`modal:${id}:positioner`)
      const getBackdropEl = (id: string) => document.getElementById(`modal:${id}:backdrop`)
      const getContentEl = (id: string) => document.getElementById(`modal:${id}:content`)
      const getTitleEl = (id: string) => document.getElementById(`modal:${id}:title`)
      const getDescriptionEl = (id: string) => document.getElementById(`modal:${id}:description`)
      const getTriggerEl = (id: string, index = 0) => document.getElementById(`modal:${id}:trigger:${index}`)
      const getCloseTriggerEl = (id: string, index = 0) => document.getElementById(`modal:${id}:close:${index}`)
      const getInstance = (id: string) => Modal.getInstance(getRootEl(id))

      return {
        getRootEl,
        getPositionerEl,
        getBackdropEl,
        getContentEl,
        getTitleEl,
        getDescriptionEl,
        getTriggerEl,
        getCloseTriggerEl,
        getInstance,
      }
    },
  )
}

// Modal markup with a title part and a description part, which name and describe the dialog; the machine wires
// aria-labelledby and aria-describedby itself. Then one ordinary button and the close button. `content` is placed
// ahead of the ordinary button.
export function MODAL({ id, forceAction = false, content = '' }: { id: string, forceAction?: boolean, content?: string }) {
  return `
  <div data-scope="modal" data-part="root" data-value="${id}"${forceAction ? ' data-force-action' : ''}>
    <div data-part="backdrop"></div>
    <div data-part="positioner">
      <div data-part="content">
        <h2 data-part="title" id="${id}-heading">Heading for ${id}</h2>
        <div data-part="description" id="${id}-description">
          <p>Description for ${id}</p>
        </div>
        ${content}
        <button type="button" id="${id}-continue">Continue</button>
        <button type="button" data-part="close-trigger">Close</button>
      </div>
    </div>
  </div>
`
}

export function TRIGGER({ id, tag = 'button', attrs = '' }: { id: string, tag?: 'button' | 'a', attrs?: string }) {
  return `<${tag} data-scope="modal" data-part="trigger" data-target="${id}" ${attrs}>Open ${id}</${tag}>`
}
