import * as datePicker from '@uswds-tailwind/date-picker-compat'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

function copyAttributes(from: HTMLElement, to: HTMLElement) {
  // Only copy class and style attributes
  const className = from.getAttribute('class')
  const style = from.getAttribute('style')

  if (className) {
    to.setAttribute('class', className)
  }

  if (style) {
    to.setAttribute('style', style)
  }
}

export class DateRangePicker extends Component<datePicker.Props, datePicker.Api> {
  initMachine(props: datePicker.Props): VanillaMachine<datePicker.DatePickerSchema> {
    return new VanillaMachine(datePicker.machine, {
      ...props,
      selectionMode: 'range',
      disabled: this.rootEl.hasAttribute('disabled'),
      readonly: this.rootEl.hasAttribute('readonly'),
      minDate: this.rootEl.getAttribute('data-min-date') || undefined,
      maxDate: this.rootEl.getAttribute('data-max-date') || undefined,
      defaultStartValue: this.startInput?.value || undefined,
      defaultEndValue: this.endInput?.value || undefined,
    })
  }

  initApi() {
    return datePicker.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    this.renderStartInput(this.startInput)
    this.renderEndInput(this.endInput)
    this.renderTriggers()

    if (this.calendar) {
      this.renderCalendar(this.calendar)
      this.renderDateGrid()
      this.renderMonthSelection()
      this.renderYearSelection()
    }

    if (this.startStatus) {
      this.renderStartStatus(this.startStatus)
    }

    if (this.endStatus) {
      this.renderEndStatus(this.endStatus)
    }
  }

  private get startInput() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-part="date-range-picker-start-input"]')
    if (!inputEl) {
      throw new Error('Expected start input element to be defined')
    }
    return inputEl
  }

  private get endInput() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-part="date-range-picker-end-input"]')
    if (!inputEl) {
      throw new Error('Expected end input element to be defined')
    }
    return inputEl
  }

  private get triggers() {
    return this.rootEl.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-trigger"]')
  }

  private get calendar() {
    const calendarEl = this.rootEl.querySelector<HTMLElement>('[data-part="date-picker-content"]')
    if (!calendarEl) {
      throw new Error('Expected calendar element to be defined')
    }
    return calendarEl
  }

  private get startStatus() {
    return this.rootEl.querySelector<HTMLElement>('[data-part="date-picker-start-status"]')
  }

  private get endStatus() {
    return this.rootEl.querySelector<HTMLElement>('[data-part="date-picker-end-status"]')
  }

  private get dateGrid() {
    const dateGridEl = this.calendar?.querySelector<HTMLElement>('[data-part="date-picker-day"]')
    if (!dateGridEl) {
      throw new Error('Expected date grid element to be defined')
    }
    return dateGridEl
  }

  private get monthSelection() {
    const monthSelectionEl = this.calendar?.querySelector<HTMLElement>('[data-part="date-picker-month"]')
    if (!monthSelectionEl) {
      throw new Error('Expected month selection element to be defined')
    }
    return monthSelectionEl
  }

  private get yearSelection() {
    const yearSelectionEl = this.calendar?.querySelector<HTMLElement>('[data-part="date-picker-year"]')
    if (!yearSelectionEl) {
      throw new Error('Expected year selection element to be defined')
    }
    return yearSelectionEl
  }

  private renderStartInput(el: HTMLInputElement) {
    spreadProps(el, this.api.getStartInputProps())
  }

  private renderEndInput(el: HTMLInputElement) {
    spreadProps(el, this.api.getEndInputProps())
  }

  private renderTriggers() {
    this.triggers.forEach((trigger) => {
      const target = trigger.getAttribute('data-target') as 'start' | 'end' | null
      if (target) {
        spreadProps(trigger, this.api.getTriggerProps(target))
      }
      else {
        spreadProps(trigger, this.api.getTriggerProps())
      }
    })
  }

  private renderCalendar(el: HTMLElement) {
    spreadProps(el, this.api.getCalendarProps())
  }

  private renderStartStatus(el: HTMLElement) {
    spreadProps(el, this.api.getStatusProps())

    const startValidationMessage = this.machine.service.context.get('startValidationMessage')
    if (startValidationMessage) {
      el.textContent = startValidationMessage
    }
  }

  private renderEndStatus(el: HTMLElement) {
    spreadProps(el, this.api.getStatusProps())

    const endValidationMessage = this.machine.service.context.get('endValidationMessage')
    if (endValidationMessage) {
      el.textContent = endValidationMessage
    }
  }

  private renderDateGrid() {
    if (!this.dateGrid)
      return

    spreadProps(this.dateGrid, this.api.getDateGridProps())

    this.cloneDayHeaders()

    this.cloneDateButtons()

    const prevButtons = this.calendar.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-nav-prev"]')
    prevButtons.forEach((button) => {
      const unit = button.getAttribute('data-unit') as 'month' | 'year' | 'decade'
      if (unit === 'decade') {
        spreadProps(button, this.api.getDecadeNavigationProps('prev'))
      }
      else if (unit) {
        spreadProps(button, this.api.getNavigationProps('prev', unit))
      }
    })

    const nextButtons = this.calendar.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-nav-next"]')
    nextButtons.forEach((button) => {
      const unit = button.getAttribute('data-unit') as 'month' | 'year' | 'decade'
      if (unit === 'decade') {
        spreadProps(button, this.api.getDecadeNavigationProps('next'))
      }
      else if (unit) {
        spreadProps(button, this.api.getNavigationProps('next', unit))
      }
    })

    const monthTrigger = this.dateGrid.querySelector<HTMLButtonElement>('[data-part="date-view-trigger"][data-value="month"]')
    if (monthTrigger) {
      const calendarDate = this.machine.ctx.get('calendarDate')
      const monthLabels = this.machine.ctx.get('monthLabels')
      monthTrigger.textContent = monthLabels[calendarDate.getMonth()]
      spreadProps(monthTrigger, this.api.getMonthYearSelectionProps('month'))
    }

    const yearTrigger = this.dateGrid.querySelector<HTMLButtonElement>('[data-part="date-view-trigger"][data-value="year"]')
    if (yearTrigger) {
      const calendarDate = this.machine.ctx.get('calendarDate')
      yearTrigger.textContent = calendarDate.getFullYear().toString()
      spreadProps(yearTrigger, this.api.getMonthYearSelectionProps('year'))
    }
  }

  private renderMonthSelection() {
    if (!this.monthSelection)
      return

    spreadProps(this.monthSelection, this.api.getMonthSelectionProps())
    this.cloneMonthButtons()
  }

  private renderYearSelection() {
    if (!this.yearSelection)
      return

    spreadProps(this.yearSelection, this.api.getYearSelectionProps())

    this.cloneYearButtons()
  }

  private cloneDayHeaders() {
    const templates = this.rootEl.querySelectorAll<HTMLElement>('[data-part="date-picker-day-header"]')
    if (templates.length === 0)
      return

    const weekDays = this.api.getWeekDays()

    if (templates.length === weekDays.length) {
      templates.forEach((header, index) => {
        if (weekDays[index]) {
          header.textContent = weekDays[index].label.charAt(0)
          spreadProps(header, weekDays[index].props)
        }
      })
      return
    }

    if (templates.length === 1) {
      const template = templates[0]
      if (!template)
        return
      const parent = template.parentElement
      if (!parent)
        return

      template.remove()

      weekDays.forEach(({ label, props }) => {
        // Create fresh element and copy class/style attributes
        const header = document.createElement('th')
        header.setAttribute('data-part', 'date-picker-day-header')
        copyAttributes(template, header)
        header.textContent = label.charAt(0)
        spreadProps(header, props)
        parent.appendChild(header)
      })
    }
  }

  private cloneDateButtons() {
    const templates = this.rootEl.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-date-button"]')
    if (templates.length === 0)
      return

    let tbody: HTMLTableSectionElement | null = null
    let templateTd: HTMLTableCellElement | null = null

    for (const template of templates) {
      const parentTd = template.parentElement
      if (parentTd && parentTd.tagName === 'TD') {
        const parentTr = parentTd.parentElement
        if (parentTr && parentTr.tagName === 'TR') {
          const parentTbody = parentTr.parentElement
          if (parentTbody && parentTbody.tagName === 'TBODY') {
            tbody = parentTbody as HTMLTableSectionElement
            templateTd = parentTd as HTMLTableCellElement
            break
          }
        }
      }
    }

    if (!tbody || !templateTd)
      return

    tbody.textContent = ''

    const calendarDate = this.machine.service.context.get('calendarDate') as Date
    const weeks = this.api.getWeeksInMonth(calendarDate)

    // Get template button for attribute copying
    const templateButton = templateTd.querySelector('[data-part="date-picker-date-button"]') as HTMLButtonElement

    weeks.forEach((week) => {
      const row = document.createElement('tr')
      week.forEach((date) => {
        if (date) {
          // Create fresh TD and button elements and copy class/style attributes
          const td = document.createElement('td')
          const button = document.createElement('button')

          // Copy class/style attributes from template elements
          copyAttributes(templateTd, td)
          if (templateButton) {
            copyAttributes(templateButton, button)
          }

          button.setAttribute('data-part', 'date-picker-date-button')
          button.textContent = String(date.getDate())

          // Apply dynamic props via spreadProps (no stale attributes!)
          spreadProps(button, this.api.getDateButtonProps(date))

          td.appendChild(button)
          row.appendChild(td)
        }
        else {
          const emptyTd = document.createElement('td')
          emptyTd.innerHTML = '&nbsp;'
          row.appendChild(emptyTd)
        }
      })
      tbody.appendChild(row)
    })
  }

  private cloneMonthButtons() {
    const templates = this.rootEl.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-month-button"]')
    if (templates.length === 0)
      return

    const monthsGrid = this.api.getMonthsGrid()

    if (templates.length === monthsGrid.length) {
      templates.forEach((button, index) => {
        if (monthsGrid[index]) {
          button.textContent = monthsGrid[index].label
          spreadProps(button, monthsGrid[index].props)
        }
      })
      return
    }

    if (templates.length >= 1) {
      let tbody: HTMLTableSectionElement | null = null
      let templateTd: HTMLTableCellElement | null = null

      for (const template of templates) {
        const parentTd = template.parentElement
        if (parentTd && parentTd.tagName === 'TD') {
          const parentTr = parentTd.parentElement
          if (parentTr && parentTr.tagName === 'TR') {
            const parentTbody = parentTr.parentElement
            if (parentTbody && parentTbody.tagName === 'TBODY') {
              tbody = parentTbody as HTMLTableSectionElement
              templateTd = parentTd as HTMLTableCellElement
              break
            }
          }
        }
      }

      if (!tbody || !templateTd)
        return

      // Get template button for attribute copying
      const templateButton = templateTd.querySelector('[data-part="date-picker-month-button"]') as HTMLButtonElement

      tbody.textContent = ''

      const monthsPerRow = 3
      const totalRows = Math.ceil(monthsGrid.length / monthsPerRow)

      for (let row = 0; row < totalRows; row++) {
        const tr = document.createElement('tr')
        for (let col = 0; col < monthsPerRow; col++) {
          const monthIndex = row * monthsPerRow + col
          if (monthIndex < monthsGrid.length) {
            const monthData = monthsGrid[monthIndex]
            if (monthData) {
              // Create fresh TD and button elements and copy class/style attributes
              const td = document.createElement('td')
              const button = document.createElement('button')

              // Copy class/style attributes from template elements
              copyAttributes(templateTd, td)
              if (templateButton) {
                copyAttributes(templateButton, button)
              }

              button.setAttribute('data-part', 'date-picker-month-button')
              button.textContent = monthData.label

              // Apply dynamic props via spreadProps
              spreadProps(button, monthData.props)

              td.appendChild(button)
              tr.appendChild(td)
            }
          }
        }
        tbody.appendChild(tr)
      }
    }
  }

  private cloneYearButtons() {
    const templates = this.rootEl.querySelectorAll<HTMLButtonElement>('[data-part="date-picker-year-button"]')
    if (templates.length === 0)
      return

    const yearsGrid = this.api.getYearsGrid()

    if (templates.length >= yearsGrid.length) {
      templates.forEach((button, index) => {
        if (yearsGrid[index]) {
          button.textContent = String(yearsGrid[index].year)
          spreadProps(button, yearsGrid[index].props)
          button.style.display = ''

          const parentTd = button.parentElement
          if (parentTd && parentTd.tagName === 'TD') {
            parentTd.style.display = ''
          }
        }
        else {
          button.style.display = 'none'

          const parentTd = button.parentElement
          if (parentTd && parentTd.tagName === 'TD') {
            parentTd.style.display = 'none'
          }
        }
      })
      return
    }

    if (templates.length >= 1) {
      let tbody: HTMLTableSectionElement | null = null
      let templateTd: HTMLTableCellElement | null = null

      for (const template of templates) {
        const parentTd = template.parentElement
        if (parentTd && parentTd.tagName === 'TD') {
          const parentTr = parentTd.parentElement
          if (parentTr && parentTr.tagName === 'TR') {
            const parentTbody = parentTr.parentElement
            if (parentTbody && parentTbody.tagName === 'TBODY') {
              tbody = parentTbody as HTMLTableSectionElement
              templateTd = parentTd as HTMLTableCellElement
              break
            }
          }
        }
      }

      if (!tbody || !templateTd)
        return

      // Get template button for attribute copying
      const templateButton = templateTd.querySelector('[data-part="date-picker-year-button"]') as HTMLButtonElement

      tbody.textContent = ''

      const yearsPerRow = 3
      const totalRows = Math.ceil(yearsGrid.length / yearsPerRow)

      for (let row = 0; row < totalRows; row++) {
        const tr = document.createElement('tr')
        for (let col = 0; col < yearsPerRow; col++) {
          const yearIndex = row * yearsPerRow + col
          if (yearIndex < yearsGrid.length) {
            const yearData = yearsGrid[yearIndex]
            if (yearData) {
              // Create fresh TD and button elements and copy class/style attributes
              const td = document.createElement('td')
              const button = document.createElement('button')

              // Copy class/style attributes from template elements
              copyAttributes(templateTd, td)
              if (templateButton) {
                copyAttributes(templateButton, button)
              }

              button.setAttribute('data-part', 'date-picker-year-button')
              button.textContent = String(yearData.year)

              // Apply dynamic props via spreadProps
              spreadProps(button, yearData.props)

              td.appendChild(button)
              tr.appendChild(td)
            }
          }
        }
        tbody.appendChild(tr)
      }
    }
  }
}

export function dateRangePickerInit() {
  document.querySelectorAll<HTMLElement>('[data-part="date-range-picker-root"]').forEach((targetEl) => {
    const dateRangePicker = new DateRangePicker(targetEl, {
      id: targetEl.id || nanoid(),
    })
    dateRangePicker.init()
  })
}
