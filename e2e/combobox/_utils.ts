import { comboboxInit } from '../../packages/compat/src/combobox'
import { createDisposableComponent } from '../_utils'

export function createDisposableCombobox(id: string, template: string) {
  return createDisposableComponent(
    template,
    comboboxInit,
    () => {
      const getRootEl = (rootId = id) => document.getElementById(`combobox:${rootId}`)!
      const getLabelEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLElement>('[data-part="label"]')!
      const getInputEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLInputElement>('[data-part="input"]')!
      const getSelectEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLSelectElement>('[data-part="hidden-select"]')!
      const getListEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLElement>('[data-part="list"]')!
      const getItemEls = (rootId = id) => Array.from(getListEl(rootId).querySelectorAll<HTMLElement>('[role="option"]'))
      const getItemEl = (value: string, rootId = id) => getItemEls(rootId).find(item => item.getAttribute('data-value') === value)!
      const getStatusEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLElement>('[data-part="status"]')!
      const getClearButtonEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLButtonElement>('[data-part="clear-trigger"]')!
      const getToggleButtonEl = (rootId = id) => getRootEl(rootId).querySelector<HTMLButtonElement>('[data-part="trigger"]')!

      return {
        getRootEl,
        getLabelEl,
        getInputEl,
        getSelectEl,
        getListEl,
        getItemEl,
        getItemEls,
        getStatusEl,
        getClearButtonEl,
        getToggleButtonEl,
      }
    },
  )
}
