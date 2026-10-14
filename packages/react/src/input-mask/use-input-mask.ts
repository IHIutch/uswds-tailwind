import type { PropTypes } from '@zag-js/react'
import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseInputMaskProps = Omit<inputMask.Props, 'getRootNode' | 'id' | 'mask'> & { id?: string, placeholder: string }

export interface UseInputMaskReturn extends inputMask.Api<PropTypes> {}

export function useInputMask(props: UseInputMaskProps): UseInputMaskReturn {
  const field = useFieldContext()
  const generatedId = React.useId()
  const { id, ids, placeholder, ...restProps } = props

  const service = useMachine(inputMask.machine, {
    id: id ?? generatedId,
    ids: {
      input: field?.ids.control,
      ...ids,
    },
    ...restProps,
    mask: placeholder,
  })

  return inputMask.connect(service, normalizeProps)
}
