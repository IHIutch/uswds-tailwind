import * as fileInput from '@uswds-tailwind/file-input-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseFileInputProps = Omit<fileInput.Props, 'getRootNode' | 'id'> & { id?: string }

export type UseFileInputReturn = ReturnType<typeof useFileInput>

export function useFileInput(props: UseFileInputProps = {}) {
  const field = useFieldContext()

  const generatedId = React.useId()
  const { id, ids, disabled = field?.disabled, ...restProps } = props

  const service = useMachine(fileInput.machine, {
    id: id ?? generatedId,
    ids: {
      input: field?.ids.control,
      label: field?.ids.label,
      ...ids,
    },
    disabled,
    ...restProps,
  })

  const api = fileInput.connect(service, normalizeProps)

  return {
    api,
    service,
    field,
  }
}
