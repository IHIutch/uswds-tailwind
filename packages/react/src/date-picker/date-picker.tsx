import type * as datepicker from '@uswds-tailwind/date-picker-compat'
import type { UseDatePickerProps } from './use-date-picker'
import { splitProps } from '@uswds-tailwind/date-picker-compat'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { Input } from '../input/input'
import { cn } from '../tv.config'
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

export type DatePickerRootProps = UseDatePickerProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof UseDatePickerProps>

const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const [machineProps, elementProps] = splitProps(props)
    const { api } = useDatePicker(machineProps)
    const mergedProps = mergeProps(api.getRootProps(), elementProps)

    return (
      <DatePickerContext.Provider value={{ api }}>
        <div {...mergedProps} className={cn('flex relative', className)} ref={forwardedRef} />
      </DatePickerContext.Provider>
    )
  },
)

type RangeBound = 'start' | 'end'

function boundToIndex(bound: RangeBound | undefined): datepicker.EndpointIndex {
  return bound === 'end' ? 1 : 0
}

const DatePickerControlContext = React.createContext<{ bound?: RangeBound } | null>(null)

function useControlBound(): RangeBound | undefined {
  return React.useContext(DatePickerControlContext)?.bound
}

const DatePickerInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const field = useFieldContext()
    const controlBound = useControlBound()

    const resolvedIndex = boundToIndex(controlBound)
    const apiProps = api.getInputProps({ index: resolvedIndex })

    const fieldProps = resolvedIndex === 0 ? field?.getInputProps() : undefined

    const describedBy = [fieldProps?.['aria-describedby'], apiProps['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined

    const mergedProps = mergeProps(apiProps, fieldProps, props, { 'aria-describedby': describedBy })

    return (
      <>
        <Input {...mergedProps} className={className} ref={forwardedRef} />
        <input {...api.getHiddenInputProps()} />
      </>
    )
  },
)

const DatePickerTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const controlBound = useControlBound()
    const resolvedIndex = boundToIndex(controlBound)

    const defaultLabel
      = controlBound === 'start'
        ? 'Open start calendar'
        : controlBound === 'end'
          ? 'Open end calendar'
          : undefined

    const apiProps = api.getTriggerProps({ index: resolvedIndex })
    const mergedProps = mergeProps(
      apiProps,
      defaultLabel ? { 'aria-label': defaultLabel } : {},
      props,
    )

    return (
      <button {...mergedProps} className={cn('cursor-pointer w-12 bg-transparent hover:bg-gray-10! data-[state=open]:bg-gray-5 active:bg-gray-30 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 flex items-center justify-center', className)} ref={forwardedRef}>
        {children || (
          <span className="icon-[material-symbols--calendar-today] size-7"></span>
        )}
      </button>
    )
  },
)

type DatePickerControlProps = React.HTMLAttributes<HTMLDivElement> & {
  // For range mode: declares which range bound this Control's Input/Trigger represent.
  bound?: RangeBound
}

function DatePickerControl({ className, bound, ...props }: DatePickerControlProps) {
  const value = React.useMemo(() => ({ bound }), [bound])
  return (
    <DatePickerControlContext.Provider value={value}>
      <div {...props} className={cn('w-full flex', className)} />
    </DatePickerControlContext.Provider>
  )
}

const DatePickerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return <div {...mergedProps} className={cn('not-data-[state=open]:hidden', className)} ref={forwardedRef} />
  },
)

function DatePickerViewControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getViewControlProps(), props)
  return <div {...mergedProps} className={cn('flex w-full justify-between', className)} />
}

export type DatePickerNavigationTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & datepicker.NavigationTriggerProps

function createNavigationTrigger(direction: 'prev' | 'next') {
  return React.forwardRef<HTMLButtonElement, DatePickerNavigationTriggerProps>(
    ({ className, children, view = 'day', unit = 'month', ...props }, forwardedRef) => {
      const { api } = useDatePickerContext()
      const navigationProps: datepicker.NavigationTriggerProps = view === 'year' ? { view } : { view, unit }
      const triggerProps = direction === 'prev' ? api.getPrevTriggerProps(navigationProps) : api.getNextTriggerProps(navigationProps)
      const mergedProps = mergeProps(triggerProps, props)
      const icon = view === 'day' && unit === 'year'
        ? direction === 'prev' ? 'icon-[material-symbols--keyboard-double-arrow-left]' : 'icon-[material-symbols--keyboard-double-arrow-right]'
        : direction === 'prev' ? 'icon-[material-symbols--keyboard-arrow-left]' : 'icon-[material-symbols--keyboard-arrow-right]'
      return (
        <button
          {...mergedProps}
          className={cn('flex items-center justify-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 disabled:cursor-not-allowed disabled:opacity-0', view === 'year' ? 'h-26 w-16 shrink-0' : 'size-10', className)}
          ref={forwardedRef}
        >
          {children || <span className={cn(icon, view === 'year' ? 'size-8' : 'size-6')} />}
        </button>
      )
    },
  )
}

const DatePickerPrevTrigger = createNavigationTrigger('prev')
const DatePickerNextTrigger = createNavigationTrigger('next')

export type DatePickerViewTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & datepicker.ViewTriggerProps

const DatePickerViewTrigger = React.forwardRef<HTMLButtonElement, DatePickerViewTriggerProps>(
  ({ className, children, view, ...props }, forwardedRef) => {
    const { api } = useDatePickerContext()
    const mergedProps = mergeProps(api.getViewTriggerProps({ view }), props)
    return (
      <button {...mergedProps} className={cn('h-10 px-1 flex items-center hover:bg-gray-10 cursor-pointer focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', className)} ref={forwardedRef}>
        {children || (view === 'month' ? api.monthLabel : api.yearLabel)}
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

    const viewProps = api.getViewProps({ view })

    const content = typeof props.children === 'function'
      ? props.children({ api })
      : props.children

    const mergedProps = mergeProps(viewProps, props)

    return (
      <DatePickerViewContext.Provider value={{ view }}>
        <div
          {...mergedProps}
          className={
            cn([
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
  const { view } = useDatePickerViewContext()
  const tableProps = api.getTableProps({ view })
  const mergedProps = mergeProps(tableProps, props)

  return <table {...mergedProps} className={cn('w-full', className)} />
}

function DatePickerTableHead({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getTableHeadProps(), props)
  const content = typeof children === 'function'
    ? children({ api })
    : children

  return <thead {...mergedProps}>{content}</thead>
}

function DatePickerTableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getTableRowProps(), props)
  return <tr {...mergedProps} />
}

function DatePickerTableHeader({ className, day, index, ...props }: Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'children'> & {
  day: datepicker.WeekDay
  index: number
  children?: React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getTableHeaderProps({ index }), props)
  return (
    <th {...mergedProps} className={cn('text-center py-1.5 font-normal', className)}>
      {props.children ?? day.narrow}
    </th>
  )
}

function DatePickerTableBody({ children, ...props }: Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'children'> & {
  children?: ((props: DatePickerContextProps) => React.ReactNode) | React.ReactNode
}) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getTableBodyProps(), props)
  const content = typeof children === 'function'
    ? children({ api })
    : children
  return <tbody {...mergedProps}>{content}</tbody>
}

type DatePickerTableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  value?: datepicker.DateValue
}

function DatePickerTableCell({ value, ...props }: DatePickerTableCellProps) {
  const { api } = useDatePickerContext()
  const cellProps = value ? api.getDayTableCellProps({ value }) : {}
  return <td {...cellProps} {...props} />
}

type DatePickerTableCellTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> & {
  value: datepicker.DateValue | number
  children?: React.ReactNode
}

function DatePickerTableCellTrigger({ className, value, children, ...props }: DatePickerTableCellTriggerProps) {
  const { api } = useDatePickerContext()
  const { view } = useDatePickerViewContext()

  const viewTriggerProps = {
    day: () => api.getDayTableCellTriggerProps({ value: value as datepicker.DateValue }),
    month: () => api.getMonthTableCellTriggerProps({ value: value as number }),
    year: () => api.getYearTableCellTriggerProps({ value: value as number }),
  }[view]()

  const mergedProps = mergeProps(viewTriggerProps, props)
  return (
    <button
      {...mergedProps}
      className={cn('w-full py-1.5 hover:bg-gray-10 cursor-pointer text-center data-previous-month:text-gray-warm-60 data-next-month:text-gray-warm-60 not-focus:data-focus:outline-2 not-focus:data-focus:outline-blue-warm-80v not-focus:data-focus:-outline-offset-2 focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4 data-range-start:bg-blue-warm-60v data-range-start:text-white data-range-start:rounded-s-sm data-range-end:bg-blue-warm-60v data-range-end:text-white data-range-end:rounded-e-sm data-in-range:bg-blue-warm-10v data-in-range:text-ink data-range-hover:bg-blue-warm-10v active:bg-gray-30 data-selected:bg-blue-warm-60v data-selected:text-white data-selected:active:bg-blue-warm-70v disabled:cursor-not-allowed disabled:opacity-60 disabled:text-black/30 disabled:hover:bg-transparent', className)}
    >
      {children}
    </button>
  )
}

function DatePickerStatus({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { api } = useDatePickerContext()
  const mergedProps = mergeProps(api.getStatusProps(), props)
  return <div {...mergedProps} className={cn('sr-only', className)}>{api.srStatusText}</div>
}

DatePickerRoot.displayName = 'DatePicker.Root'
DatePickerInput.displayName = 'DatePicker.Input'
DatePickerTrigger.displayName = 'DatePicker.Trigger'
DatePickerControl.displayName = 'DatePicker.Control'
DatePickerView.displayName = 'DatePicker.View'
DatePickerContent.displayName = 'DatePicker.Content'
DatePickerViewControl.displayName = 'DatePicker.ViewControl'
DatePickerPrevTrigger.displayName = 'DatePicker.PrevTrigger'
DatePickerNextTrigger.displayName = 'DatePicker.NextTrigger'
DatePickerViewTrigger.displayName = 'DatePicker.ViewTrigger'
DatePickerTable.displayName = 'DatePicker.Table'
DatePickerTableHead.displayName = 'DatePicker.TableHead'
DatePickerTableRow.displayName = 'DatePicker.TableRow'
DatePickerTableHeader.displayName = 'DatePicker.TableHeader'
DatePickerTableBody.displayName = 'DatePicker.TableBody'
DatePickerTableCell.displayName = 'DatePicker.TableCell'
DatePickerTableCellTrigger.displayName = 'DatePicker.TableCellTrigger'
DatePickerStatus.displayName = 'DatePicker.Status'

export const DatePicker = {
  Root: DatePickerRoot,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Control: DatePickerControl,
  View: DatePickerView,
  Content: DatePickerContent,
  ViewControl: DatePickerViewControl,
  PrevTrigger: DatePickerPrevTrigger,
  NextTrigger: DatePickerNextTrigger,
  ViewTrigger: DatePickerViewTrigger,
  Table: DatePickerTable,
  TableHead: DatePickerTableHead,
  TableRow: DatePickerTableRow,
  TableHeader: DatePickerTableHeader,
  TableBody: DatePickerTableBody,
  TableCell: DatePickerTableCell,
  TableCellTrigger: DatePickerTableCellTrigger,
  Status: DatePickerStatus,
}
