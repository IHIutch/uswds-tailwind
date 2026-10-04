import * as table from '@uswds-tailwind/table-compat'
import { query, queryAll } from '@zag-js/dom-query'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataEnum, getDataString } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = table.anatomy.build()

function getCellValue(cell: HTMLTableCellElement | undefined) {
  // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- USWDS sorts layout-aware innerText before falling back to textContent.
  return cell?.getAttribute('data-sort-value') || cell?.dataset.sort || cell?.innerText || cell?.textContent || ''
}

function sortRows(tbody: HTMLTableSectionElement, columnIndex: number, direction: table.SortDirection) {
  const rows = Array.from(tbody.rows, tr => ({
    tr,
    value: getCellValue(tr.cells[columnIndex]),
  }))
  rows.sort((a, b) => {
    const first = direction === 'ascending' ? a.value : b.value
    const second = direction === 'ascending' ? b.value : a.value
    if (first && second && !Number.isNaN(Number(first)) && !Number.isNaN(Number(second)))
      return Number(first) - Number(second)
    return first.localeCompare(second, navigator.language, { numeric: true, ignorePunctuation: true })
  })
  tbody.append(...rows.map(row => row.tr))
}

export class Table extends Component<table.Props, table.Api> {
  static override root = parts.root

  initMachine(props: table.Props): VanillaMachine<table.Schema> {
    const column = getDataString(this.rootEl, 'sort-column')
    const parsedColumn = column === undefined || column === '' ? undefined : Number(column)
    const rootSortColumn = parsedColumn !== undefined && Number.isInteger(parsedColumn) && parsedColumn >= 0
      ? parsedColumn
      : undefined
    const initialHeader = this.headers.find(header => ['ascending', 'descending'].includes(header.getAttribute('aria-sort') ?? ''))
    const headerSortColumn = initialHeader
      ? Array.from(initialHeader.parentElement!.children).indexOf(initialHeader)
      : undefined
    const headerSortDirection = initialHeader?.getAttribute('aria-sort') === 'ascending' ? 'ascending' : initialHeader ? 'descending' : undefined
    const columnIndex = rootSortColumn ?? headerSortColumn
    const direction = getDataEnum(this.rootEl, 'sort-direction', ['ascending', 'descending']) ?? headerSortDirection ?? 'ascending'
    const columnNames: Record<number, string> = {}
    for (const header of this.headers) {
      const index = Array.from(header.parentElement!.children).indexOf(header)
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- USWDS uses layout-aware innerText.
      columnNames[index] ??= header.innerText.trim()
    }
    return new VanillaMachine(table.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'table'),
      defaultSortDescriptor: props.defaultSortDescriptor !== undefined ? props.defaultSortDescriptor : columnIndex === undefined ? null : { column: columnIndex, direction },
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- USWDS uses layout-aware innerText.
      captionText: props.captionText ?? query<HTMLElement>(this.table, 'caption')?.innerText,
      columnNames: props.columnNames ?? columnNames,
    })
  }

  initApi() {
    return table.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.table, this.api.getTableProps())
    this.renderStatus(this.status)
    this.headers.forEach(header => this.renderHeader(header))

    Array.from(this.tbody.rows).forEach(row => this.renderRow(row))

    if (this.api.sortDescriptor) {
      sortRows(this.tbody, this.api.sortDescriptor.column, this.api.sortDescriptor.direction)
    }
  }

  private get status() {
    const status = getPart<HTMLElement>(this.rootEl, parts.srStatus)
    if (!status)
      throw new Error('Expected table sort status element to be defined')
    return status
  }

  private get table() {
    const tableEl = getPart<HTMLTableElement>(this.rootEl, parts.table)
    if (!tableEl)
      throw new Error('Expected table element to be defined')
    return tableEl
  }

  private get headers() {
    return queryAll<HTMLTableCellElement>(this.table, 'thead th[data-sortable]')
  }

  private get tbody() {
    const tbodyEl = query<HTMLTableSectionElement>(this.table, 'tbody')
    if (!tbodyEl)
      throw new Error('Missing tbody')
    return tbodyEl
  }

  private renderStatus(status: HTMLElement) {
    spreadProps(status, this.api.getSrStatusProps())
    status.textContent = this.api.announcement
  }

  private renderHeader(header: HTMLTableCellElement) {
    const columnIndex = Array.from(header.parentElement!.children).indexOf(header)
    // eslint-disable-next-line unicorn/prefer-dom-node-text-content
    const headerName = header.innerText.trim()
    const details = { columnIndex, headerName }
    spreadProps(header, this.api.getHeaderProps(details))
    const button = query<HTMLButtonElement>(header, 'button')
    if (button)
      spreadProps(button, this.api.getSortTriggerProps(details))
  }

  private renderRow(row: HTMLTableRowElement) {
    Array.from(row.cells).forEach((cell, columnIndex) => {
      spreadProps(cell, this.api.getCellProps({ columnIndex }))
    })
  }
}

export function tableInit() {
  return Table.createAll(document)
}
