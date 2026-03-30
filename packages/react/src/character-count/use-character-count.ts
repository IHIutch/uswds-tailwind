import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseCharacterCountProps = Omit<characterCount.Props, 'getRootNode' | 'id'>

export type UseCharacterCountReturn = ReturnType<typeof useCharacterCount>

export function useCharacterCount(props: UseCharacterCountProps) {
  const field = useFieldContext()

  const {
    // TODO: Fix disabled inheritance from field context
    // disabled = field?.disabled,
    ...restProps
  } = props

  const service = useMachine(characterCount.machine, {
    id: React.useId(),
    ids: {
      label: field?.ids.label,
      input: field?.ids.control,
      status: field?.ids.description,
    },
    // TODO: Fix disabled inheritance from field context
    // disabled,
    ...restProps,
  })

  const api = characterCount.connect(service, normalizeProps)

  return {
    api,
    service,
    field,
  }
}
