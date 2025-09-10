import { collapseInit } from '../../packages/compat/src/collapse'
import { createDisposableComponent } from '../_utils'

export function createDisposableCollapse(id: string, template: string) {
  return createDisposableComponent(
    template,
    collapseInit,
    () => {
      const getRootEl = () => document.getElementById(`collapse:${id}`)
      const getTriggerEl = () => document.getElementById(`collapse:${id}:trigger`)
      const getContentEl = () => document.getElementById(`collapse:${id}:content`)

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
      }
    },
  )
}
