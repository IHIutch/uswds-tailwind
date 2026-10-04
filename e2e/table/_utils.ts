import { tableInit } from '../../packages/compat/src/table'
import { createDisposableComponent } from '../_utils'

export function createDisposableTable(id: string, template: string) {
  return createDisposableComponent(
    template,
    tableInit,
    () => {
      const getRootEl = () => document.getElementById(`table:${id}`) as HTMLElement
      const getTbodyEl = () => document.getElementById(`table:${id}:tbody`) as HTMLTableSectionElement
      const getSrStatusEl = () => document.getElementById(`table:${id}:sr-status`) as HTMLElement
      const getHeaderEl = (index: number) => getRootEl().querySelectorAll<HTMLTableCellElement>('thead th')[index]!
      const getSortButtonEl = (index: number) => getHeaderEl(index)?.querySelector<HTMLButtonElement>('button')

      return {
        getRootEl,
        getTbodyEl,
        getSrStatusEl,
        getHeaderEl,
        getSortButtonEl,
      }
    },
  )
}
