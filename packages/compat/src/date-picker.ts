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

export class DatePicker extends Component<datePicker.Props, datePicker.Api> {
  initMachine(props: datePicker.Props): VanillaMachine<datePicker.DatePickerSchema> {
    return new VanillaMachine(datePicker.machine, {
      ...props,
      disabled: this.rootEl.hasAttribute('disabled'),
      readonly: this.rootEl.hasAttribute('readonly'),
      minDate: this.rootEl.getAttribute('data-min-date') || undefined,
      maxDate: this.rootEl.getAttribute('data-max-date') || undefined,
      defaultStartValue: this.input?.value || undefined,
    })
  }

  initApi() {
    return datePicker.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    this.renderInput(this.input)
    this.renderTrigger(this.trigger)

    if (this.calendar) {
      this.renderCalendar(this.calendar)
      this.renderDateGrid()
      this.renderMonthSelection()
      this.renderYearSelection()
    }

    if (this.status) {
      this.renderStatus(this.status)
    }
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-part="date-picker-input"]')
    if (!inputEl) {
      throw new Error('Expected input element to be defined')
    }
    return inputEl
  }

  private get trigger() {
    const triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-part="date-picker-trigger"]')
    if (!triggerEl) {
      throw new Error('Expected trigger element to be defined')
    }
    return triggerEl
  }

  private get calendar() {
    const calendarEl = this.rootEl.querySelector<HTMLElement>('[data-part="date-picker-content"]')
    if (!calendarEl) {
      throw new Error('Expected calendar element to be defined')
    }
    return calendarEl
  }

  private get status() {
    return this.rootEl.querySelector<HTMLElement>('[data-part="date-picker-status"]')
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

  private renderInput(el: HTMLInputElement) {
    spreadProps(el, this.api.getInputProps())
  }

  private renderTrigger(el: HTMLButtonElement) {
    spreadProps(el, this.api.getTriggerProps())
  }

  private renderCalendar(el: HTMLElement) {
    spreadProps(el, this.api.getCalendarProps())
  }

  private renderStatus(el: HTMLElement) {
    spreadProps(el, this.api.getStatusProps())

    const validationMessage = this.machine.service.context.get('validationMessage')
    if (validationMessage) {
      el.textContent = validationMessage
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

    spreadProps(this.monthSelection, this.api.getMonthPickerProps())
    this.cloneMonthButtons()
  }

  private renderYearSelection() {
    if (!this.yearSelection)
      return

    spreadProps(this.yearSelection, this.api.getYearPickerProps())

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
        const header = document.createElement(template.tagName.toLowerCase())
        copyAttributes(template, header)
        header.setAttribute('data-part', 'date-picker-day-header')
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

    const calendarDates = this.api.getCalendarDates()

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

    weeks.forEach((week) => {
      const row = document.createElement('tr')
      week.forEach((date) => {
        if (date) {
          const dateData = calendarDates.find(d => d.date.getTime() === date.getTime())
          if (dateData) {
            const td = document.createElement('td')
            copyAttributes(templateTd!, td)
            const templateButton = templateTd!.querySelector('[data-part="date-picker-date-button"]') as HTMLButtonElement
            if (templateButton) {
              const button = document.createElement('button')
              copyAttributes(templateButton, button)
              button.setAttribute('data-part', 'date-picker-date-button')
              button.textContent = String(date.getDate())
              spreadProps(button, this.api.getDateButtonProps(date))
              td.appendChild(button)
            }
            row.appendChild(td)
          }
          else {
            const td = document.createElement('td')
            copyAttributes(templateTd!, td)
            const templateButton = templateTd!.querySelector('[data-part="date-picker-date-button"]') as HTMLButtonElement
            if (templateButton) {
              const button = document.createElement('button')
              copyAttributes(templateButton, button)
              button.setAttribute('data-part', 'date-picker-date-button')
              button.textContent = String(date.getDate())
              spreadProps(button, this.api.getDateButtonProps(date))
              td.appendChild(button)
            }
            row.appendChild(td)
          }
        }
        else {
          const emptyTd = document.createElement('td')
          emptyTd.style.cssText = templateTd!.style.cssText
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
              const td = document.createElement('td')
              copyAttributes(templateTd, td)
              const templateButton = templateTd.querySelector('[data-part="date-picker-month-button"]') as HTMLButtonElement
              if (templateButton) {
                const button = document.createElement('button')
                copyAttributes(templateButton, button)
                button.setAttribute('data-part', 'date-picker-month-button')
                button.textContent = monthData.label
                spreadProps(button, monthData.props)
                td.appendChild(button)
              }
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
              const td = document.createElement('td')
              copyAttributes(templateTd, td)
              const templateButton = templateTd.querySelector('[data-part="date-picker-year-button"]') as HTMLButtonElement
              if (templateButton) {
                const button = document.createElement('button')
                copyAttributes(templateButton, button)
                button.setAttribute('data-part', 'date-picker-year-button')
                button.textContent = String(yearData.year)
                spreadProps(button, yearData.props)
                td.appendChild(button)
              }
              tr.appendChild(td)
            }
          }
        }
        tbody.appendChild(tr)
      }
    }
  }
}

export function datePickerInit() {
  document.querySelectorAll<HTMLElement>('[data-part="date-picker-root"]').forEach((targetEl) => {
    const datePicker = new DatePicker(targetEl, {
      id: targetEl.id || nanoid(),
    })
    datePicker.init()
  })
}
