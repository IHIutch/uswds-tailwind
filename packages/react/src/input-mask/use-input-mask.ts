import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseInputMaskProps = Omit<inputMask.Props, 'getRootNode' | 'id'>

export type UseInputMaskReturn = ReturnType<typeof useInputMask>

export function useInputMask(props: UseInputMaskProps) {
  const field = useFieldContext()

  const { ...restProps } = props

  const service = useMachine(inputMask.machine, {
    id: React.useId(),
    ids: {
      input: field?.ids.control,
    },
    ...restProps,
  })

  const api = inputMask.connect(service, normalizeProps)

  return {
    api,
    service,
    field,
  }
}
