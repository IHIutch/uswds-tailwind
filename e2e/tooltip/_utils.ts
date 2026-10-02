import type * as tooltip from '../../packages/machines/tooltip-compat/src'
import { Tooltip, tooltipInit } from '../../packages/compat/src/tooltip'
import { createDisposableComponent } from '../_utils'

export function createDisposableTooltip(id: string, template: string, props?: tooltip.Props) {
  return createDisposableComponent(
    template,
    () => props === undefined ? tooltipInit() : [new Tooltip(document.getElementById(id), props).init()],
    () => {
      const getRootEl = () => document.getElementById(`tooltip:${id}`)!
      const getTriggerEl = () => document.getElementById(`tooltip:${id}:trigger`)!
      const getContentEl = () => document.getElementById(`tooltip:${id}:content`)!
      const getInstance = () => Tooltip.getInstance(getRootEl())
      return { getRootEl, getTriggerEl, getContentEl, getInstance }
    },
  )
}

export function createDisposableTooltips(template: string) {
  return createDisposableComponent(
    template,
    tooltipInit,
    () => ({
      getRootEl: (id: string) => document.getElementById(`tooltip:${id}`)!,
      getTriggerEl: (id: string) => document.getElementById(`tooltip:${id}:trigger`)!,
      getContentEl: (id: string) => document.getElementById(`tooltip:${id}:content`)!,
      getInstance: (id: string) => Tooltip.getInstance(document.getElementById(`tooltip:${id}`)),
    }),
  )
}

export function TOOLTIP(id: string, placement = 'top') {
  return `<span data-scope="tooltip" data-part="root" data-placement="${placement}" id="${id}">
    <button data-part="trigger" title="Tooltip ${id}">Trigger ${id}</button>
    <span data-part="content"></span>
  </span>`
}
