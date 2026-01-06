import { tooltipInit } from '../../packages/compat/src/tooltip'
import { createDisposableComponent } from '../_utils'

export function createDisposableTooltip(id: string, template: string) {
  return createDisposableComponent(
    template,
    tooltipInit,
    () => {
      const getRootEl = () => document.getElementById(`tooltip:${id}`)!
      const getTriggerEl = () => document.getElementById(`tooltip:${id}:trigger`)!
      const getContentEl = () => document.getElementById(`tooltip:${id}:content`)!

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
      }
    },
  )
}
