import type { Schema } from '@uswds-tailwind/date-picker-compat'
import * as datePicker from '@uswds-tailwind/date-picker-compat'
import { query, queryAll } from '@zag-js/dom-query'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = datePicker.anatomy.build()

function cloneCell(template: HTMLTableCellElement, button: HTMLButtonElement) {
  const cell = template.cloneNode(false) as HTMLTableCellElement
  const clone = button.cloneNode(false) as HTMLButtonElement
  cell.append(clone)
  return { cell, button: clone }
}

export class DatePicker extends Component<datePicker.Props, datePicker.Api> {
  static override root = parts.root
  private dayTemplate?: HTMLTableCellElement
  private monthTemplate?: HTMLTableCellElement
  private yearTemplate?: HTMLTableCellElement

  initMachine(props: datePicker.Props): VanillaMachine<Schema> {
    const input = this.input
    const defaultValue = datePicker.parseDateString(getDataString(this.rootEl, 'default-value'))
    return new VanillaMachine(datePicker.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'date-picker'),
      ids: { ...props.ids, input: props.ids?.input || input.id || undefined },
      name: props.name ?? input.name,
      required: props.required ?? input.required,
      disabled: props.disabled ?? (this.rootEl.hasAttribute('disabled') || input.disabled),
      readOnly: props.readOnly ?? (this.rootEl.hasAttribute('readonly') || input.readOnly || input.hasAttribute('aria-disabled')),
      min: props.min ?? datePicker.parseDateString(getDataString(this.rootEl, 'min-date') || input.getAttribute('min')),
      max: props.max ?? datePicker.parseDateString(getDataString(this.rootEl, 'max-date') || input.getAttribute('max')),
      rangeAnchor: props.rangeAnchor ?? datePicker.parseDateString(getDataString(this.rootEl, 'range-date')),
      defaultDate: props.defaultDate ?? datePicker.parseDateString(getDataString(this.rootEl, 'default-date')),
      defaultValue: props.defaultValue ?? (defaultValue ? [defaultValue] : []),
    })
  }

  initApi() {
    return datePicker.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.input, this.api.getInputProps())
    spreadProps(this.hiddenInput, this.api.getHiddenInputProps())
    spreadProps(this.trigger, this.api.getTriggerProps())
    this.renderCalendar()
  }

  protected renderCalendar() {
    spreadProps(this.calendar, this.api.getContentProps())
    if (this.status) {
      spreadProps(this.status, this.api.getStatusProps())
      this.status.textContent = this.api.srStatusText
    }
    for (const view of ['day', 'month', 'year'] as const)
      spreadProps(query<HTMLElement>(this.calendar, `[data-part=view][data-view=${view}]`)!, this.api.getViewProps({ view }))
    if (!this.api.open)
      return
    if (this.api.view === 'day')
      this.renderDayView()
    else if (this.api.view === 'month')
      this.renderMonthView()
    else
      this.renderYearView()
  }

  private get input() {
    const el = getPart<HTMLInputElement>(this.rootEl, parts.input)
    if (!el)
      throw new Error('Expected input element to be defined')
    return el
  }

  private get hiddenInput() {
    return getPart<HTMLInputElement>(this.rootEl, parts.hiddenInput)!
  }

  private get trigger() {
    return getPart<HTMLButtonElement>(this.rootEl, parts.trigger)!
  }

  private get calendar() {
    return getPart<HTMLElement>(this.rootEl, parts.content)!
  }

  private get status() {
    return getPart<HTMLElement>(this.rootEl, parts.status)
  }

  private get dayView() {
    return query<HTMLElement>(this.calendar, '[data-part=view][data-view=day]')!
  }

  private get monthView() {
    return query<HTMLElement>(this.calendar, '[data-part=view][data-view=month]')!
  }

  private get yearView() {
    return query<HTMLElement>(this.calendar, '[data-part=view][data-view=year]')!
  }

  private renderDayView() {
    const view = this.dayView
    const control = getPart<HTMLElement>(view, parts.viewControl)!
    spreadProps(control, this.api.getViewControlProps())
    const nav = [
      [parts.prevTrigger, this.api.getPrevTriggerProps({ unit: 'year' })],
      [parts.prevTrigger, this.api.getPrevTriggerProps({ unit: 'month' })],
      [parts.viewTrigger, this.api.getViewTriggerProps({ view: 'month' })],
      [parts.viewTrigger, this.api.getViewTriggerProps({ view: 'year' })],
      [parts.nextTrigger, this.api.getNextTriggerProps({ unit: 'month' })],
      [parts.nextTrigger, this.api.getNextTriggerProps({ unit: 'year' })],
    ] as const
    for (const [part, props] of nav) {
      const button = part === parts.viewTrigger
        ? query<HTMLButtonElement>(control, `[data-part=view-trigger][data-view=${props['data-view']}]`)
        : query<HTMLButtonElement>(control, `[data-part=${props['data-part']}][data-unit=${props['data-unit']}]`)
      if (button) {
        spreadProps(button, props)
        if (part === parts.viewTrigger)
          button.textContent = props['data-view'] === 'month' ? this.api.monthLabel : this.api.yearLabel
      }
    }
    const table = query<HTMLTableElement>(view, 'table')!
    const head = table.tHead!
    const body = table.tBodies[0]!
    spreadProps(table, this.api.getTableProps())
    spreadProps(head, this.api.getTableHeadProps())
    spreadProps(body, this.api.getTableBodyProps())
    const header = getPart<HTMLTableCellElement>(head, parts.tableHeader)
    if (header) {
      const row = header.parentElement!
      spreadProps(row, this.api.getTableRowProps())
      if (row.children.length !== this.api.weekDays.length)
        row.replaceChildren(...this.api.weekDays.map(() => header.cloneNode(false)))
      this.api.weekDays.forEach((day, index) => {
        const cell = row.children[index] as HTMLTableCellElement
        cell.textContent = day.narrow
        spreadProps(cell, this.api.getTableHeaderProps({ index }))
      })
    }
    if (!this.dayTemplate)
      this.dayTemplate = query(body, 'td')?.cloneNode(true) as HTMLTableCellElement
    const templateCell = this.dayTemplate
    if (!templateCell)
      return
    const templateButton = getPart<HTMLButtonElement>(templateCell, parts.tableCellTrigger)!
    const dates = this.api.weeks.flat()
    const existing = queryAll<HTMLButtonElement>(body, '[data-part="table-cell-trigger"]')
    if (existing.length === dates.length && existing.every((button, index) => button.dataset.value === datePicker.formatDate(dates[index]!))) {
      existing.forEach((button, index) => {
        const date = dates[index]!
        spreadProps(button.parentElement!, this.api.getDayTableCellProps({ value: date }))
        spreadProps(button, this.api.getDayTableCellTriggerProps({ value: date }))
      })
      return
    }
    body.textContent = ''
    for (const week of this.api.weeks) {
      const row = document.createElement('tr')
      spreadProps(row, this.api.getTableRowProps())
      for (const date of week) {
        const { cell, button } = cloneCell(templateCell, templateButton)
        spreadProps(cell, this.api.getDayTableCellProps({ value: date }))
        button.textContent = String(date.getDate())
        spreadProps(button, this.api.getDayTableCellTriggerProps({ value: date }))
        row.append(cell)
      }
      body.append(row)
    }
  }

  private renderMonthView() {
    const view = this.monthView
    const table = query<HTMLTableElement>(view, 'table')!
    const body = table.tBodies[0]!
    spreadProps(table, this.api.getTableProps({ view: 'month' }))
    if (!this.monthTemplate)
      this.monthTemplate = query(body, 'td')?.cloneNode(true) as HTMLTableCellElement
    this.renderSelectionCells(
      body,
      this.monthTemplate,
      this.api.monthRows,
      month => this.api.monthLabels[month] ?? '',
      (button, month) => spreadProps(button, this.api.getMonthTableCellTriggerProps({ value: month })),
    )
  }

  private renderYearView() {
    const view = this.yearView
    const previous = query<HTMLButtonElement>(view, '[data-part=prev-trigger][data-unit=chunk]')
    const next = query<HTMLButtonElement>(view, '[data-part=next-trigger][data-unit=chunk]')
    const table = query<HTMLTableElement>(view, 'table')!
    const body = table.tBodies[0]!

    if (previous)
      spreadProps(previous, this.api.getPrevTriggerProps({ unit: 'chunk' }))
    if (next)
      spreadProps(next, this.api.getNextTriggerProps({ unit: 'chunk' }))
    spreadProps(table, this.api.getTableProps({ view: 'year' }))

    if (!this.yearTemplate)
      this.yearTemplate = query(body, 'td')?.cloneNode(true) as HTMLTableCellElement

    this.renderSelectionCells(
      body,
      this.yearTemplate,
      this.api.yearRows,
      year => String(year),
      (button, year) => spreadProps(button, this.api.getYearTableCellTriggerProps({ value: year })),
    )
  }

  private renderSelectionCells(
    body: HTMLTableSectionElement,
    templateCell: HTMLTableCellElement | undefined,
    rows: number[][],
    getLabel: (value: number) => string,
    updateButton: (button: HTMLButtonElement, value: number) => void,
  ) {
    if (!templateCell)
      return
    const values = rows.flat()
    const existing = queryAll<HTMLButtonElement>(body, '[data-part="table-cell-trigger"]')
    if (existing.length === values.length && existing.every((button, index) => button.dataset.value === String(values[index]))) {
      existing.forEach((button, index) => updateButton(button, values[index]!))
      return
    }

    const templateButton = getPart<HTMLButtonElement>(templateCell, parts.tableCellTrigger)!
    body.textContent = ''
    for (const valueRow of rows) {
      const row = document.createElement('tr')
      for (const value of valueRow) {
        const { cell, button } = cloneCell(templateCell, templateButton)
        button.textContent = getLabel(value)
        updateButton(button, value)
        row.append(cell)
      }
      body.append(row)
    }
  }

  async enable() {
    this.machine.updateProps({ disabled: false })
    await this.settle()
  }

  async disable() {
    this.machine.updateProps({ disabled: true })
    await this.settle()
  }
}

export function datePickerInit() {
  return DatePicker.createAll(document)
}
