import type { VanillaDropdownProps } from '../../packages/compat/src/dropdown'
import { Dropdown, dropdownInit } from '../../packages/compat/src/dropdown'
import { createDisposableComponent } from '../_utils'

export function createDisposableDropdown(id: string, template: string, props?: VanillaDropdownProps) {
  return createDisposableComponent(
    template,
    () => props === undefined
      ? dropdownInit()
      : [new Dropdown(document.getElementById(id), props).init()],
    () => {
      const getRootEl = () => document.getElementById(`dropdown:${id}`)
      const getTriggerEl = () => document.getElementById(`dropdown:${id}:trigger`) as HTMLButtonElement
      const getContentEl = () => document.getElementById(`dropdown:${id}:content`)
      const getItemEls = () => Array.from(getContentEl()?.querySelectorAll<HTMLElement>('[data-part="item"]') ?? [])

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getItemEls,
      }
    },
  )
}

export function createDisposableDropdowns(template: string) {
  return createDisposableComponent(
    template,
    dropdownInit,
    () => ({
      getRootEl: (id: string) => document.getElementById(`dropdown:${id}`),
      getTriggerEl: (id: string) => document.getElementById(`dropdown:${id}:trigger`) as HTMLButtonElement,
      getContentEl: (id: string) => document.getElementById(`dropdown:${id}:content`),
    }),
  )
}
