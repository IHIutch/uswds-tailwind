import type * as dropdown from '../../packages/machines/dropdown-compat/src'
import { Dropdown, dropdownInit } from '../../packages/compat/src/dropdown'
import { createDisposableComponent } from '../_utils'

export function createDisposableDropdown(id: string, template: string, props?: dropdown.Props) {
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
      const getInstance = () => Dropdown.getInstance(getRootEl())

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getItemEls,
        getInstance,
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
      getInstance: (id: string) => Dropdown.getInstance(document.getElementById(`dropdown:${id}`)),
    }),
  )
}

export function DROPDOWN({ id, state, content }: { id: string, state?: 'open' | 'closed', content?: string }) {
  return `
    <nav data-scope="dropdown" data-part="root" id="${id}"${state ? ` data-state="${state}"` : ''}>
      <button data-part="trigger" type="button">Open ${id}</button>
      <ul data-part="content" style="position: absolute">
        ${content ?? `
          <li data-part="item" data-value="${id}-item">
            <a href="#${id}-item">${id} item</a>
          </li>
        `}
      </ul>
    </nav>
  `
}
