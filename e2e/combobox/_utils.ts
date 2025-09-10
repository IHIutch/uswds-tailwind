import { comboboxInit } from '../../packages/compat/src/combobox'
import { createDisposableComponent } from '../_utils'

export function createDisposableCombobox(id: string, template: string) {
  return createDisposableComponent(
    template,
    comboboxInit,
    () => {
      const getRootEl = () => document.getElementById(`combobox:${id}`)!
      const getLabelEl = () => document.getElementById(`combobox:${id}:label`)!
      const getInputEl = () => document.getElementById(`combobox:${id}:input`)! as HTMLInputElement
      const getSelectEl = () => document.getElementById(`combobox:${id}:select`)! as HTMLSelectElement
      const getListEl = () => document.getElementById(`combobox:${id}:list`)!
      const getItemEl = (value: string) => document.getElementById(`combobox:${id}:item:${value}`)!
      const getClearButtonEl = () => document.getElementById(`combobox:${id}:clear-button`)! as HTMLButtonElement
      const getToggleButtonEl = () => document.getElementById(`combobox:${id}:toggle-button`)! as HTMLButtonElement

      return {
        getRootEl,
        getLabelEl,
        getInputEl,
        getSelectEl,
        getListEl,
        getItemEl,
        getClearButtonEl,
        getToggleButtonEl,
      }
    },
  )
}
