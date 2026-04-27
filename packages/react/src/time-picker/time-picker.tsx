import type * as combobox from '@uswds-tailwind/combobox-compat'
import * as React from 'react'
import { Combobox } from '../combobox'
import { cx } from '../cva.config'

// Pre-generated to avoid creating a new array on every render
const DEFAULT_TIME_OPTIONS = generateTimeOptions()

export type TimePickerRootProps = React.ComponentProps<typeof Combobox.Root> & {
  options?: combobox.ComboboxOption[]
}

function TimePickerRoot({ options = DEFAULT_TIME_OPTIONS, className, ...props }: TimePickerRootProps) {
  return (
    <Combobox.Root
      options={options}
      customFilter={filterTimeOptions}
      {...props}
      className={cx('max-w-40', className)}
    />
  )
}

TimePickerRoot.displayName = 'TimePicker.Root'

export const TimePicker = {
  Root: TimePickerRoot,
  Label: Combobox.Label,
  Control: Combobox.Control,
  Input: Combobox.Input,
  List: Combobox.List,
  Item: Combobox.Item,
  EmptyItem: Combobox.EmptyItem,
  IndicatorGroup: Combobox.IndicatorGroup,
  ClearButton: Combobox.ClearButton,
  ToggleButton: Combobox.ToggleButton,
}

export function generateTimeOptions(interval = 30): combobox.ComboboxOption[] {
  const options: combobox.ComboboxOption[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hour24 = h.toString().padStart(2, '0')
      const min = m.toString().padStart(2, '0')
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const period = h < 12 ? 'am' : 'pm'
      options.push({
        text: `${hour12}:${min}${period}`,
        value: `${hour24}:${min}`,
      })
    }
  }
  return options
}

function filterTimeOptions(inputValue: string, options: combobox.ComboboxOption[]): combobox.ComboboxOption[] {
  if (!inputValue)
    return options

  const query = inputValue.replace(/\s/g, '').toLowerCase()
  const match = query.match(/^(\d{0,2}):?(\d{0,2})([ap])?/)
  if (!match)
    return options

  const [, hourStr, minStr, period] = match
  const hourPattern = hourStr || '\\d+'
  const minPattern = minStr ? minStr.padEnd(2, '\\d') : '\\d{2}'
  const periodPattern = period ? `${period}m` : '[ap]m'

  const regex = new RegExp(`^${hourPattern}:${minPattern}${periodPattern}$`, 'i')

  const matches = options.filter(o => regex.test(o.text))
  return matches.length > 0 ? matches : options
}
