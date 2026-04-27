import type * as datepicker from '@uswds-tailwind/date-picker-compat'
import type { UseDatePickerProps } from './use-date-picker'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'
import { useDatePicker } from './use-date-picker'

export interface DatePickerContextProps {
  api: datepicker.Api
}

const DatePickerContext = React.createContext<DatePickerContextProps | null>(null)

function useDatePickerContext(): DatePickerContextProps {
  const context = React.useContext(DatePickerContext)
  if (!context) {
    throw new Error('DatePicker components must be used within a DatePicker.Root')
  }
  return context
}

export type DatePickerRootProps = UseDatePickerProps & React.ComponentPropsWithoutRef<'div'>

const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePicker(props)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <DatePickerContext.Provider value={{ api }}>
        <div {...mergedProps} className={cx('flex relative', className)} ref={forwardedRef} />
      </DatePickerContext.Provider>
    )
  },
)

const DatePickerInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const field = useFieldContext()

    const apiProps = api.getInputProps()
    const fieldProps = field?.getInputProps()

    // Combine aria-describedby from both api (status region) and field (description/error)
    const describedBy = [fieldProps?.['aria-describedby'], apiProps['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined

    const mergedProps = mergeProps(apiProps, fieldProps, props, { 'aria-describedby': describedBy })

    return <Input {...mergedProps} className={cx('', className)} ref={forwardedRef} />
  },
)

const DatePickerTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <button {...mergedProps} className={cx('cursor-pointer w-12 bg-transparent hover:bg-gray-10! data-[state=open]:bg-gray-5 active:bg-gray-30 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 flex items-center justify-center', className)} ref={forwardedRef}>
        {children || (
          <span className="icon-[material-symbols--calendar-today] size-7"></span>
        )}
      </button>
    )
  },
)

function DatePickerControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('w-full flex', className)} />
}

const DatePickerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getCalendarProps(), props)

    return <div {...mergedProps} className={cx('not-data-[state=open]:hidden', className)} ref={forwardedRef} />
  },
)

function DatePickerViewControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx('flex w-full justify-between', className)} />
}

const DatePickerNextMonthTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getNextMonthTriggerProps(), props)

    return (
      <button {...mergedProps} className={cx('size-10 flex items-center justify-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--keyboard-arrow-right] size-6"></div>
        )}
      </button>
    )
  },
)

const DatePickerPrevMonthTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getPrevMonthTriggerProps(), props)

    return (
      <button {...mergedProps} className={cx('size-10 flex items-center justify-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--keyboard-arrow-left] size-6"></div>
        )}
      </button>
    )
  },
)

const DatePickerNextYearTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getNextYearTriggerProps(), props)

    return (
      <button {...mergedProps} className={cx('size-10 flex items-center justify-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--keyboard-double-arrow-right] size-6"></div>
        )}
      </button>
    )
  },
)

const DatePickerPrevYearTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getPrevYearTriggerProps(), props)

    return (
      <button {...mergedProps} className={cx('size-10 flex items-center justify-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--keyboard-double-arrow-left] size-6"></div>
        )}
      </button>
    )
  },
)

const DatePickerMonthTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getMonthSelectionProps(), props)

    return (
      <button {...mergedProps} className={cx('h-10 px-1 flex items-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', className)} ref={forwardedRef}>
        {children || api.monthLabel}
      </button>
    )
  },
)

const DatePickerYearTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getYearSelectionProps(), props)

    return (
      <button {...mergedProps} className={cx('h-10 px-1 flex items-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', className)} ref={forwardedRef}>
        {children || api.yearLabel}
      </button>
    )
  },
)

const DatePickerViewContext = React.createContext<{
  view: datepicker.Api['view']
} | null>(null)

function useDatePickerViewContext() {
  const context = React.useContext(DatePickerViewContext)
  if (!context) {
    throw new Error('DatePickerView components must be used within a DatePicker.View')
  }
  return context
}

const DatePickerView = React.forwardRef<HTMLDivElement, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  view: datepicker.Api['view']
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}>(
  ({ className, view, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()

    const viewProps = {
      day: api.getDayPickerProps(),
      month: api.getMonthPickerProps(),
      year: api.getYearPickerProps(),
    }[view]

    const content = typeof props.children === 'function'
      ? props.children({ api })
      : props.children

    const mergedProps = mergeProps(viewProps, props)

    return (
      <DatePickerViewContext.Provider value={{ view }}>
        <div
          {...mergedProps}
          className={
            cx([
              view === 'month' || view === 'year' ? 'py-5 px-2' : '',
              view === 'year' ? 'flex items-center' : '',
              'bg-gray-5 w-mobile absolute top-10 right-0',
              className,
            ])
          }
          ref={forwardedRef}
        >
          {content}
        </div>
      </DatePickerViewContext.Provider>
    )
  },
)

function DatePickerTable({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getGridProps(), props)

  return <table {...mergedProps} className={cx('w-full', className)} />
}

function DatePickerTableHead({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getHeaderProps(), props)
  const content = typeof children === 'function'
    ? children({ api })
    : children

  return <thead {...mergedProps}>{content}</thead>
}

function DatePickerTableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getRowProps(), props)
  return <tr {...mergedProps} />
}

function DatePickerTableHeader({ className, day, ...props }: Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'children'> & {
  day: datepicker.WeekDay
  children?: React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getHeaderCellProps({ day }), props)
  return (
    <th {...mergedProps} className={cx('text-center py-1.5 font-normal', className)}>
      {props.children ?? day.narrow}
    </th>
  )
}

function DatePickerTableBody({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getBodyProps(), props)
  const content = typeof children === 'function'
    ? children({ api })
    : children
  return <tbody {...mergedProps}>{content}</tbody>
}

type DatePickerTableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  cell?: datepicker.DayCell
}

function DatePickerTableCell({ cell, ...props }: DatePickerTableCellProps) {
  const { api } = useDatePickerContext()
  const cellProps = cell ? api.getCellProps({ cell }) : {}
  return <td {...cellProps} {...props} />
}

type DatePickerTableCellTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  cell: datepicker.DayCell | datepicker.MonthCell | datepicker.YearCell
  children?: React.ReactNode
}

function DatePickerTableCellTrigger({ className, cell, children, ...props }: DatePickerTableCellTriggerProps) {
  const { api } = useDatePickerContext()
  const { view } = useDatePickerViewContext()

  const viewTriggerProps = {
    day: () => api.getDayCellTriggerProps({ cell: cell as datepicker.DayCell }),
    month: () => api.getMonthCellTriggerProps({ cell: cell as datepicker.MonthCell }),
    year: () => api.getYearCellTriggerProps({ cell: cell as datepicker.YearCell }),
  }[view]()

  const mergedProps = mergeProps(viewTriggerProps, props)
  return (
    <button
      {...mergedProps}
      className={cx('w-full py-1.5 hover:bg-gray-10 cursor-pointer text-center data-previous-month:text-gray-warm-60 data-next-month:text-gray-warm-60 not-focus:data-focus:outline-2 not-focus:data-focus:outline-blue-warm-80v not-focus:data-focus:-outline-offset-2 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 data-range-start:bg-blue-warm-60v data-range-start:text-white data-range-start:rounded-s-sm data-range-end:bg-blue-warm-60v data-range-end:text-white data-range-end:rounded-e-sm data-in-range:bg-blue-warm-10v data-in-range:text-ink data-range-hover:bg-blue-warm-10v active:bg-gray-30 data-selected:bg-blue-warm-60v data-selected:text-white data-selected:active:bg-blue-warm-70v disabled:cursor-not-allowed disabled:opacity-60 disabled:text-black/30 disabled:hover:bg-transparent', className)}
    >
      {children}
    </button>
  )
}

function DatePickerPrevDecadeTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getPrevYearChunkTriggerProps(), props)

  return (
    <button {...mergedProps} className={cx('hover:bg-gray-10 cursor-pointer text-center h-26 w-16 shrink-0 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)}>
      {children || (
        <div className="icon-[material-symbols--keyboard-arrow-left] size-8"></div>
      )}
    </button>
  )
}

function DatePickerNextDecadeTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getNextYearChunkTriggerProps(), props)

  return (
    <button {...mergedProps} className={cx('hover:bg-gray-10 cursor-pointer text-center h-26 w-16 shrink-0 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)}>
      {children || (
        <div className="icon-[material-symbols--keyboard-arrow-right] size-8"></div>
      )}
    </button>
  )
}

function DatePickerStatus({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getStatusProps(), props)
  return <div {...mergedProps} className={cx('sr-only', className)}>{api.statusMessage}</div>
}

DatePickerRoot.displayName = 'DatePicker.Root'
DatePickerInput.displayName = 'DatePicker.Input'
DatePickerTrigger.displayName = 'DatePicker.Trigger'
DatePickerControl.displayName = 'DatePicker.Control'
DatePickerView.displayName = 'DatePicker.View'
DatePickerContent.displayName = 'DatePicker.Content'
DatePickerViewControl.displayName = 'DatePicker.ViewControl'
DatePickerNextMonthTrigger.displayName = 'DatePicker.NextMonthTrigger'
DatePickerPrevMonthTrigger.displayName = 'DatePicker.PrevMonthTrigger'
DatePickerNextYearTrigger.displayName = 'DatePicker.NextYearTrigger'
DatePickerPrevYearTrigger.displayName = 'DatePicker.PrevYearTrigger'
DatePickerMonthTrigger.displayName = 'DatePicker.MonthTrigger'
DatePickerYearTrigger.displayName = 'DatePicker.YearTrigger'
DatePickerTable.displayName = 'DatePicker.Table'
DatePickerTableHead.displayName = 'DatePicker.TableHead'
DatePickerTableRow.displayName = 'DatePicker.TableRow'
DatePickerTableHeader.displayName = 'DatePicker.TableHeader'
DatePickerTableBody.displayName = 'DatePicker.TableBody'
DatePickerTableCell.displayName = 'DatePicker.TableCell'
DatePickerTableCellTrigger.displayName = 'DatePicker.TableCellTrigger'
DatePickerPrevDecadeTrigger.displayName = 'DatePicker.PrevDecadeTrigger'
DatePickerNextDecadeTrigger.displayName = 'DatePicker.NextDecadeTrigger'
DatePickerStatus.displayName = 'DatePicker.Status'

export const DatePicker = {
  Root: DatePickerRoot,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Control: DatePickerControl,
  View: DatePickerView,
  Content: DatePickerContent,
  ViewControl: DatePickerViewControl,
  NextMonthTrigger: DatePickerNextMonthTrigger,
  PrevMonthTrigger: DatePickerPrevMonthTrigger,
  NextYearTrigger: DatePickerNextYearTrigger,
  PrevYearTrigger: DatePickerPrevYearTrigger,
  MonthTrigger: DatePickerMonthTrigger,
  YearTrigger: DatePickerYearTrigger,
  Table: DatePickerTable,
  TableHead: DatePickerTableHead,
  TableRow: DatePickerTableRow,
  TableHeader: DatePickerTableHeader,
  TableBody: DatePickerTableBody,
  TableCell: DatePickerTableCell,
  TableCellTrigger: DatePickerTableCellTrigger,
  PrevDecadeTrigger: DatePickerPrevDecadeTrigger,
  NextDecadeTrigger: DatePickerNextDecadeTrigger,
  Status: DatePickerStatus,
}
