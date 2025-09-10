import { dropdownInit } from '../../packages/compat/src/dropdown'
import { createDisposableComponent } from '../_utils'

export function createDisposableDropdown(id: string, template: string) {
  return createDisposableComponent(
    template,
    dropdownInit,
    () => {
      const getRootEl = () => document.getElementById(`dropdown:${id}`)
      const getTriggerEl = () => document.getElementById(`dropdown:${id}:trigger`) as HTMLButtonElement
      const getContentEl = () => document.getElementById(`dropdown:${id}:content`)
      const getItemEls = () => Array.from(getContentEl()?.querySelectorAll<HTMLElement>('[data-part="dropdown-item"]') ?? [])

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getItemEls,
      }
    },
  )
}
