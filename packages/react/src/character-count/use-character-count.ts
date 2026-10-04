import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseCharacterCountProps = Omit<characterCount.Props, 'getRootNode' | 'id'>

export function useCharacterCount(props: UseCharacterCountProps) {
  const field = useFieldContext()

  const service = useMachine(characterCount.machine, {
    id: React.useId(),
    ids: {
      input: field?.ids.control,
      status: field?.ids.description,
    },
    ...props,
  })

  return characterCount.connect(service, normalizeProps)
}
