import * as combobox from '@uswds-tailwind/combobox-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseComboboxProps = Omit<combobox.Props, 'getRootNode' | 'id'> & { id?: string }

export type UseComboboxReturn = ReturnType<typeof useCombobox>

export function useCombobox(props: UseComboboxProps = {}) {
  const field = useFieldContext()

  const generatedId = React.useId()
  const { id, disabled = field?.disabled, ids, ...restProps } = props

  const service = useMachine(combobox.machine, {
    id: id ?? generatedId,
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
      ...ids,
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
