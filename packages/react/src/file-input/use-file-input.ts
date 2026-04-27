import * as fileInput from '@uswds-tailwind/file-input-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseFileInputProps = Omit<fileInput.Props, 'getRootNode' | 'id'>

export type UseFileInputReturn = ReturnType<typeof useFileInput>

export function useFileInput(props: UseFileInputProps = {}) {
  const field = useFieldContext()

  const { disabled = field?.disabled, ...restProps } = props

  const service = useMachine(fileInput.machine, {
    id: React.useId(),
    ids: {
      input: field?.ids.control,
      label: field?.ids.label,
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
