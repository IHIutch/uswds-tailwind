import * as table from '@uswds-tailwind/table-compat'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

export class Table extends Component<table.Props, table.Api> {
  static instances = new Map<string, Table>()

  static getInstance(id: string) {
    return Table.instances.get(id)
  }

  initMachine(props: table.Props): VanillaMachine<table.Schema> {
    Table.instances.set(props.id, this)

    const srStatusEl = document.createElement('div')
    srStatusEl.setAttribute('data-part', 'table-sr-status')
    srStatusEl.setAttribute('data-value', props.id)
    this.rootEl.after(srStatusEl)

    return new VanillaMachine(table.machine, {
      ...props,
    })
  }

  initApi() {
    return table.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    this.headerCells.forEach((cell) => {
      const columnIndex = Array.from(this.rootEl.querySelectorAll('th')).indexOf(cell)
      // Only render sortable headers
      if (cell.hasAttribute('data-sortable')) {
        this.renderHeaderCell(cell, columnIndex)
      }
    })

    this.renderSrStatus(this.srStatus)
    this.renderBodyCells()
    this.sortTableRows()
  }

  private get headerCells() {
    return Array.from(this.rootEl.querySelectorAll<HTMLTableCellElement>('[data-part="table-header-cell"]'))
  }

  private get bodyRows() {
    return Array.from(this.rootEl.querySelectorAll<HTMLTableRowElement>('tbody tr'))
  }

  private renderHeaderCell(cell: HTMLTableCellElement, index: number) {
    spreadProps(cell, this.api.getHeaderCellProps(index))

    const button = cell.querySelector<HTMLButtonElement>('[data-part="table-sort-button"]')
    if (button) {
      this.renderSortButton(button, index)
    }
  }

  private renderSortButton(button: HTMLButtonElement, index: number) {
    spreadProps(button, this.api.getSortButtonProps(index))
  }

  private renderBodyCells() {
    this.bodyRows.forEach((row) => {
      const cells = row.querySelectorAll<HTMLTableCellElement>('[data-part="table-body-cell"]')
      cells.forEach((cell, columnIndex) => {
        this.renderBodyCell(cell, columnIndex)
      })
    })
  }

  private renderBodyCell(cell: HTMLTableCellElement, columnIndex: number) {
    spreadProps(cell, this.api.getBodyCellProps(columnIndex))
  }

  private get srStatus() {
    const srStatusEl = document.querySelector<HTMLElement>(`[data-part="table-sr-status"][data-value="${this.machine.scope.id}"]`)
    if (!srStatusEl) {
      throw new Error('Expected srStatus element to exist')
    }
    return srStatusEl
  }

  private renderSrStatus(srStatusEl: HTMLElement) {
    spreadProps(srStatusEl, this.api.getSrStatusProps())
    srStatusEl.textContent = this.machine.ctx.get('srStatus')
  }

  private sortTableRows() {
    const { sortedColumn, sortDirection } = this.api
    if (sortedColumn === -1 || !sortDirection)
      return

    const rows = this.bodyRows
    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('[data-part="table-body-cell"]')[sortedColumn]
      const cellB = b.querySelectorAll('[data-part="table-body-cell"]')[sortedColumn]

      if (!cellA || !cellB)
        return 0

      const valueA = cellA.getAttribute('data-sort-value') || cellA.textContent || ''
      const valueB = cellB.getAttribute('data-sort-value') || cellB.textContent || ''

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

    const tbodyEl = this.rootEl.querySelector<HTMLTableSectionElement>('tbody')
    rows.forEach((row) => {
      // Clear previous data-sort-active attributes
      Array.from(row.children).forEach(cell => cell.removeAttribute('data-sort-active'))
      // Set data-sort-active on the sorted column
      if (row.children[sortedColumn]) {
        row.children[sortedColumn].setAttribute('data-sort-active', 'true')
      }
      tbodyEl!.appendChild(row)
    })
  }

  sortByColumn(columnIndex: number) {
    this.api.sortByColumn(columnIndex)
  }
}

export function tableInit() {
  document.querySelectorAll<HTMLTableElement>('[data-part="table-root"]').forEach((targetEl) => {
    const table = new Table(targetEl, {
      id: targetEl.id || nanoid(),
    })

    table.init()
  })
}
