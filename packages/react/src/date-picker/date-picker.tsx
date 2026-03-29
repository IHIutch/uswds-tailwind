import * as datepicker from '@uswds-tailwind/date-picker-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'

export interface DatePickerContextProps {
  api: datepicker.Api
  context: datepicker.Service['context']
}

const DatePickerContext = React.createContext<DatePickerContextProps | null>(null)

function useDatePickerContext(): DatePickerContextProps {
  const context = React.useContext(DatePickerContext)
  if (!context) {
    throw new Error('DatePicker components must be used within a DatePicker.Root')
  }
  return context
}

// export default DatePickerContext;
export type DatePickerRootProps = Omit<datepicker.Props, 'id'> & React.ComponentPropsWithoutRef<'div'>

const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()

    const service = useMachine(datepicker.machine, {
      id: React.useId(),
      ids: {
        input: field?.ids.control,
      },
      disabled: props.disabled ?? field?.disabled,
      ...props,
    })

    const api = datepicker.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <DatePickerContext.Provider value={{ api, context: service.context }}>
        <div {...mergedProps} className={cx('flex relative', className)} ref={forwardedRef} />
      </DatePickerContext.Provider>
    )
  },
)

const DatePickerInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const { 'aria-describedby': _, 'aria-invalid': __, ...inputProps } = api.getInputProps()
    const mergedProps = mergeProps(inputProps, props)

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

const DatePickerControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={cx('w-full flex', className)} ref={forwardedRef} />
  },
)

const DatePickerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return <div {...mergedProps} className={cx('not-data-[state=open]:hidden', className)} ref={forwardedRef} />
  },
)

const DatePickerViewControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={cx('flex w-full justify-between', className)} ref={forwardedRef} />
  },
)

const DatePickerNextMonthTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getNavigationProps('next', 'month'), props)

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
    const mergedProps = mergeProps(api.getNavigationProps('prev', 'month'), props)

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
    const mergedProps = mergeProps(api.getNavigationProps('next', 'year'), props)

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
    const mergedProps = mergeProps(api.getNavigationProps('prev', 'year'), props)

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
    const { api, context } = useDatePickerContext()
    const mergedProps = mergeProps(api.getMonthYearSelectionProps('month'), props)
    const monthLabels = context.get('monthLabels')
    const month = context.get('calendarDate').getMonth()

    return (
      <button {...mergedProps} className={cx('h-10 px-1 flex items-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', className)} ref={forwardedRef}>
        {children || monthLabels[month]}
      </button>
    )
  },
)

const DatePickerYearTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api, context } = useDatePickerContext()
    const mergedProps = mergeProps(api.getMonthYearSelectionProps('year'), props)
    const year = context.get('calendarDate').getFullYear()

    return (
      <button {...mergedProps} className={cx('h-10 px-1 flex items-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', className)} ref={forwardedRef}>
        {children || year}
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
    const { api, context } = useDatePickerContext()

    const viewProps = {
      day: api.getDayViewProps(),
      month: api.getMonthViewProps(),
      year: api.getYearViewProps(),
    }[view]

    const content = typeof props.children === 'function'
      ? props.children({ api, context })
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

const DatePickerTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getTableProps(), props)

    return <table {...mergedProps} className={cx('w-full', className)} ref={forwardedRef} />
  },
)

function DatePickerTableHead({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api, context } = useDatePickerContext()
  const content = typeof children === 'function'
    ? children({ api, context })
    : children

  return <thead {...props}>{content}</thead>
}

function DatePickerTableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />
}

const DatePickerTableHeader = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement> & {
  dayIndex: number
}>(
  ({ className, dayIndex, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getTableHeaderProps(dayIndex), props)
    return <th {...mergedProps} className={cx('text-center py-1.5 font-normal', className)} ref={forwardedRef} />
  },
)

function DatePickerTableBody({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api, context } = useDatePickerContext()
  const content = typeof children === 'function'
    ? children({ api, context })
    : children
  return <tbody {...props}>{content}</tbody>
}

function DatePickerTableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} />
}

function DatePickerTableCellTrigger({ className, value, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: number
}) {
  const { api } = useDatePickerContext()
  const { view } = useDatePickerViewContext()

  const viewTriggerProps = {
    day: api.getDayButtonProps(new Date(value)),
    month: api.getMonthButtonProps(value),
    year: api.getYearButtonProps(value),
  }[view]

  const mergedProps = mergeProps(viewTriggerProps, props)
  return <button {...mergedProps} className={cx('w-full py-1.5 hover:bg-gray-10 cursor-pointer text-center data-[month-context=prev]:text-gray-warm-60 data-[month-context=next]:text-gray-warm-60 not-focus:data-focus:outline-2 not-focus:data-focus:outline-blue-warm-80v not-focus:data-focus:-outline-offset-2 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 data-range-start:bg-blue-warm-60v data-range-start:text-white data-range-start:rounded-s-sm data-range-end:bg-blue-warm-60v data-range-end:text-white data-range-end:rounded-e-sm data-in-range:bg-blue-warm-10v data-in-range:text-ink data-range-hover:bg-blue-warm-10v active:bg-gray-30 data-selected:bg-blue-warm-60v data-selected:text-white data-selected:active:bg-blue-warm-70v disabled:cursor-not-allowed disabled:opacity-60 disabled:text-black/30 disabled:hover:bg-transparent', className)} />
}

function DatePickerPrevDecadeTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getDecadeNavigationProps('prev'), props)

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
  const mergedProps = mergeProps(api.getDecadeNavigationProps('next'), props)

  return (
    <button {...mergedProps} className={cx('hover:bg-gray-10 cursor-pointer text-center h-26 w-16 shrink-0 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', className)}>
      {children || (
        <div className="icon-[material-symbols--keyboard-arrow-right] size-8"></div>
      )}
    </button>
  )
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
}
