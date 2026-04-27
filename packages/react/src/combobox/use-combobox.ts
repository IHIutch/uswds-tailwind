import * as combobox from '@uswds-tailwind/combobox-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseComboboxProps = Omit<combobox.Props, 'getRootNode' | 'id'>

export type UseComboboxReturn = ReturnType<typeof useCombobox>

export function useCombobox(props: UseComboboxProps = {}) {
  const field = useFieldContext()

  const { disabled = field?.disabled, ...restProps } = props

  const service = useMachine(combobox.machine, {
    id: React.useId(),
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
    },
    disabled,
    ...restProps,
  })

  const api = combobox.connect(service, normalizeProps)

  return {
    api,
    service,
    field,
  }
}
