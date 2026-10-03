import type * as table from '../../packages/machines/table-compat/src'
import { Table, tableInit } from '../../packages/compat/src/table'
import { createDisposableComponent } from '../_utils'

export function createDisposableTable(id: string, template: string, props?: table.Props) {
  const getRootEl = () => (document.getElementById(`table:${id}`) ?? document.getElementById(id)) as HTMLElement
  const getTheadEl = () => document.getElementById(`table:${id}:thead`) as HTMLTableSectionElement
  const getTbodyEl = () => document.getElementById(`table:${id}:tbody`) as HTMLTableSectionElement
  const getTfootEl = () => document.getElementById(`table:${id}:tfoot`) as HTMLTableSectionElement
  const getSrStatusEl = () => document.getElementById(`table:${id}:sr-status`) as HTMLElement
  const getHeaderEl = (index: number) => getRootEl().querySelectorAll<HTMLTableCellElement>('thead th')[index]!
  const getSortButtonEl = (index: number) => getHeaderEl(index)?.querySelector<HTMLButtonElement>('button')

  const getInstance = () => Table.getInstance(getRootEl())

  return createDisposableComponent(
    template,
    () => props === undefined
      ? tableInit()
      : [new Table(getRootEl(), props).init()],
    () => {
      return {
        getRootEl,
        getTheadEl,
        getTbodyEl,
        getTfootEl,
        getSrStatusEl,
        getHeaderEl,
        getSortButtonEl,
        getInstance,
      }
    },
  )
}
