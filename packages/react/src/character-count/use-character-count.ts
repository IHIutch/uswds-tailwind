import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { useFieldContext } from '../field/field'

export type UseCharacterCountProps = Omit<characterCount.Props, 'getRootNode' | 'id'> & { id?: string }

export function useCharacterCount(props: UseCharacterCountProps) {
  const field = useFieldContext()
  const generatedId = React.useId()
  const { id, ids, ...rest } = props

  const service = useMachine(characterCount.machine, {
    id: id ?? generatedId,
    ids: {
      input: field?.ids.control,
      status: field?.ids.description,
      ...ids,
    },
    ...rest,
  })

  return characterCount.connect(service, normalizeProps)
}
