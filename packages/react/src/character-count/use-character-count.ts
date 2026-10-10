import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'

export type UseCharacterCountProps = Omit<characterCount.Props, 'getRootNode' | 'id'> & { id?: string }

export function useCharacterCount(props: UseCharacterCountProps) {
  const generatedId = React.useId()
  const { id, ...rest } = props

  const service = useMachine(characterCount.machine, {
    id: id ?? generatedId,
    ...rest,
  })

  return characterCount.connect(service, normalizeProps)
}
