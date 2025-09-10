import { modalInit } from '../../packages/compat/src/modal'
import { createDisposableComponent } from '../_utils'

export function createDisposableModal(id: string, template: string) {
  return createDisposableComponent(
    template,
    modalInit,
    () => {
      const getPositionerEl = () => document.getElementById(`modal:${id}:positioner`)
      const getBackdropEl = () => document.getElementById(`modal:${id}:backdrop`)
      const getContentEl = () => document.getElementById(`modal:${id}:content`)
      const getTriggerEl = () => document.getElementById(`modal:${id}:trigger`)
      const getCloseTriggerEl = () => document.getElementById(`modal:${id}:close`)

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
