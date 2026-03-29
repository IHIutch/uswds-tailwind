import type { UseMemorableDateProps, UseMemorableDateReturn } from './use-memorable-date'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { Field } from '../field'
import { Input } from '../input'
import { Select } from '../select'
import { useMemorableDate } from './use-memorable-date'

const MemorableDateContext = React.createContext<UseMemorableDateReturn | null>(null)

export function useMemorableDateContext() {
  const context = React.useContext(MemorableDateContext)
  if (!context) {
    throw new Error('MemorableDate components must be used within a MemorableDate.Root')
  }
  return context
}

export type MemorableDateRootProps = React.ComponentPropsWithoutRef<'fieldset'> & UseMemorableDateProps

function MemorableDateRoot({ className, children, id, disabled, invalid, ...props }: MemorableDateRootProps) {
  const memorableDate = useMemorableDate({ id, disabled, invalid })
  const mergedProps = mergeProps(memorableDate.getRootProps(), props)

  return (
    <MemorableDateContext.Provider value={memorableDate}>
      <fieldset
        {...mergedProps}
        className={className}
      >
        {children}
      </fieldset>
    </MemorableDateContext.Provider>
  )
}

export type MemorableDateLegendProps = React.ComponentPropsWithoutRef<'legend'>

function MemorableDateLegend({ className, ...props }: MemorableDateLegendProps) {
  const { getLegendProps } = useMemorableDateContext()
  const mergedProps = mergeProps(getLegendProps(), props)

  return <legend {...mergedProps} className={className} />
}

export type MemorableDateDescriptionProps = React.ComponentPropsWithoutRef<'div'>

function MemorableDateDescription({ className, ...props }: MemorableDateDescriptionProps) {
  const { getDescriptionProps } = useMemorableDateContext()
  const mergedProps = mergeProps(getDescriptionProps(), props)

  return <div {...mergedProps} className={cx('text-gray-50', className)} />
}

export type MemorableDateControlProps = React.ComponentPropsWithoutRef<'div'>

function MemorableDateControl({ className, ...props }: MemorableDateControlProps) {
  return <div {...props} className={cx('flex flex-wrap gap-4 mt-4', className)} />
}

const MONTHS = [
  { value: '', label: '- Select -' },
  { value: '1', label: '01 - January' },
  { value: '2', label: '02 - February' },
  { value: '3', label: '03 - March' },
  { value: '4', label: '04 - April' },
  { value: '5', label: '05 - May' },
  { value: '6', label: '06 - June' },
  { value: '7', label: '07 - July' },
  { value: '8', label: '08 - August' },
  { value: '9', label: '09 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' },
]

function MemorableDateMonth({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field.Root className="w-60">
      <Field.Label>Month</Field.Label>
      <Select.Root>
        <Select.Field {...props} className={className}>
          {MONTHS.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>
  )
}

function MemorableDateDay({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field.Root className="w-12">
      <Field.Label>Day</Field.Label>
      <Input maxLength={2} inputMode="numeric" pattern="[0-9]*" {...props} className={cx('mt-2', className)} />
    </Field.Root>
  )
}

function MemorableDateYear({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field.Root className="w-20">
      <Field.Label>Year</Field.Label>
      <Input minLength={4} maxLength={4} inputMode="numeric" pattern="[0-9]*" {...props} className={cx('mt-2', className)} />
    </Field.Root>
  )
}

MemorableDateRoot.displayName = 'MemorableDate.Root'
MemorableDateLegend.displayName = 'MemorableDate.Legend'
MemorableDateDescription.displayName = 'MemorableDate.Description'
MemorableDateControl.displayName = 'MemorableDate.Control'
MemorableDateMonth.displayName = 'MemorableDate.Month'
MemorableDateDay.displayName = 'MemorableDate.Day'
MemorableDateYear.displayName = 'MemorableDate.Year'

export const MemorableDate = {
  Root: MemorableDateRoot,
  Legend: MemorableDateLegend,
  Description: MemorableDateDescription,
  Control: MemorableDateControl,
  Month: MemorableDateMonth,
  Day: MemorableDateDay,
  Year: MemorableDateYear,
}
