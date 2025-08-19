import * as table from '@uswds-tailwind/table-compat'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

export class Table extends Component<table.Props, table.Api> {
  initMachine(props: table.Props): VanillaMachine<table.Schema> {
    return new VanillaMachine(table.machine, {
      ...props,
    })
  }

  initApi() {
    return table.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    this.headerCells.forEach((cell, index) => {
      this.renderHeaderCell(cell, index)
    })

    this.renderBodyCells()
    this.sortTableRows()
  }

  private get headerCells() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-part="table-header-cell"]'))
  }

  private get bodyRows() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('tbody tr'))
  }

  private renderHeaderCell(cell: HTMLElement, index: number) {
    spreadProps(cell, this.api.getHeaderCellProps(index))

    const button = cell.querySelector<HTMLElement>('[data-part="table-sort-button"]')
    if (button) {
      this.renderSortButton(button, index)
    }
  }

  private renderSortButton(button: HTMLElement, index: number) {
    spreadProps(button, this.api.getSortButtonProps(index))
  }

  private renderBodyCells() {
    this.bodyRows.forEach((row) => {
      const cells = row.querySelectorAll<HTMLElement>('[data-part="table-body-cell"]')
      cells.forEach((cell, columnIndex) => {
        this.renderBodyCell(cell, columnIndex)
      })
    })
  }

  private renderBodyCell(cell: HTMLElement, columnIndex: number) {
    spreadProps(cell, this.api.getBodyCellProps(columnIndex))
  }

  private sortTableRows() {
    const { sortedColumn, sortDirection } = this.api
    if (sortedColumn === -1 || sortDirection === 'none')
      return

    const rows = this.bodyRows
    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('[data-part="table-body-cell"]')[sortedColumn]
      const cellB = b.querySelectorAll('[data-part="table-body-cell"]')[sortedColumn]

      if (!cellA || !cellB)
        return 0

      const valueA = cellA.getAttribute('data-value') || cellA.textContent || ''
      const valueB = cellB.getAttribute('data-value') || cellB.textContent || ''

      if (Number.isNaN(Number(valueA)) || Number.isNaN(Number(valueB))) {
        const result = valueA.localeCompare(valueB, navigator.language, {
          numeric: true,
          ignorePunctuation: true,
        })
        return sortDirection === 'asc' ? result : -result
      }
      else {
        const result = Number(valueA) - Number(valueB)
        return sortDirection === 'asc' ? result : -result
      }
    })

    const tbodyEl = this.rootEl.querySelector<HTMLElement>('tbody')
    rows.forEach(row => tbodyEl!.appendChild(row))
  }

  sortByColumn(columnIndex: number) {
    this.api.sortByColumn(columnIndex)
  }
}

export function tableInit() {
  document.querySelectorAll<HTMLElement>('[data-part="table-root"]').forEach((targetEl) => {
    const table = new Table(targetEl, {
      id: targetEl.id || nanoid(),
    })
    table.init()
  })
}
