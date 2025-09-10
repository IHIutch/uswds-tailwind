import { tableInit } from '../../packages/compat/src/table'
import { createDisposableComponent } from '../_utils'

export function createDisposableTable(id: string, template: string) {
  return createDisposableComponent(
    template,
    tableInit,
    () => {
      const getRootEl = () => document.getElementById(`table:${id}`) as HTMLTableElement
      const getTheadEl = () => document.getElementById(`table:${id}:thead`) as HTMLTableSectionElement
      const getTbodyEl = () => document.getElementById(`table:${id}:tbody`) as HTMLTableSectionElement
      const getTfootEl = () => document.getElementById(`table:${id}:tfoot`) as HTMLTableSectionElement
      const getSrStatusEl = () => document.getElementById(`table:${id}:sr-status`) as HTMLElement

      return {
        getRootEl,
        getTheadEl,
        getTbodyEl,
        getTfootEl,
        getSrStatusEl,
      }
    },
  )
}
