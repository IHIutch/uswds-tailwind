import { Collapse, collapseInit } from '../../packages/compat/src/collapse'
import { createDisposableComponent } from '../_utils'

export function createDisposableCollapse(id: string, template: string) {
  return createDisposableComponent(
    template,
    collapseInit,
    () => {
      const getRootEl = () => document.getElementById(`collapse:${id}`)
      const getTriggerEl = () => document.getElementById(`collapse:${id}:trigger`)
      const getContentEl = () => document.getElementById(`collapse:${id}:content`)
      const getInstance = () => Collapse.getInstance(getRootEl())

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getInstance,
      }
    },
  )
}

export function createDisposableCollapses(template: string) {
  return createDisposableComponent(
    template,
    collapseInit,
    () => {
      const getRootEl = (id: string) => document.getElementById(`collapse:${id}`)
      const getTriggerEl = (id: string) => document.getElementById(`collapse:${id}:trigger`)
      const getContentEl = (id: string) => document.getElementById(`collapse:${id}:content`)
      const getInstance = (id: string) => Collapse.getInstance(getRootEl(id))

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getInstance,
      }
    },
  )
}
