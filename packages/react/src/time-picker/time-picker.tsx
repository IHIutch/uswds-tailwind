import type * as combobox from '@uswds-tailwind/combobox-compat'
import * as React from 'react'
import { Combobox } from '../combobox'
import { cx } from '../cva.config'

// Pre-generated to avoid creating a new array on every render
const DEFAULT_TIME_OPTIONS = generateTimeOptions()

type TimePickerRootProps = React.ComponentProps<typeof Combobox.Root> & {
  options?: combobox.ComboboxOption[]
}

function TimePickerRoot({ options = DEFAULT_TIME_OPTIONS, className, ...props }: TimePickerRootProps) {
  return <Combobox.Root options={options} disableFiltering customFilter={findTimeMatch} {...props} className={cx('max-w-40', className)} />
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
        label: `${hour12}:${min}${period}`,
        value: `${hour24}:${min}`,
      })
    }
  }
  return options
}

/**
 * Time filter matches input like "5", "5:30", "5p", "530p", "12:30a"
 * Builds a regex from the input to find the best matching time option.
 */
function findTimeMatch(inputValue: string, options: combobox.ComboboxOption[]): number {
  if (!inputValue)
    return options.length > 0 ? 0 : -1

  const query = inputValue.replace(/\s/g, '').toLowerCase()

  // Extract parts: optional hour, optional :minutes, optional a/p
  const match = query.match(/^(\d{0,2}):?(\d{0,2})([ap])?/)
  if (!match)
    return -1

  const [, hourStr, minStr, period] = match

  // Build a regex pattern for matching time labels
  const hourPattern = hourStr || '\\d+'
  const minPattern = minStr ? minStr.padEnd(2, '\\d') : '\\d{2}'
  const periodPattern = period ? `${period}m` : '[ap]m'

  const regex = new RegExp(`^${hourPattern}:${minPattern}${periodPattern}$`, 'i')

  const idx = options.findIndex(o => regex.test(o.label))
  return idx >= 0 ? idx : -1
}
