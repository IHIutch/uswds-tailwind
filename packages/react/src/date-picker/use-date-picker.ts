import * as datepicker from '@uswds-tailwind/date-picker-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseDatePickerProps = Omit<datepicker.Props, 'getRootNode' | 'id'>

export type UseDatePickerReturn = ReturnType<typeof useDatePicker>

export function useDatePicker(props: UseDatePickerProps = {}) {
  const field = useFieldContext()

  const { disabled = field?.disabled, ...restProps } = props

  const service = useMachine(datepicker.machine, {
    id: React.useId(),
    ids: {
      input: field?.ids.control,
    },
    disabled,
    ...restProps,
  })

  const api = datepicker.connect(service, normalizeProps)

  return {
    api,
    service,
    field,
  }
}
