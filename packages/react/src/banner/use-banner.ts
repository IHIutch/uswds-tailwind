import * as collapse from '@uswds-tailwind/collapse-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export type UseBannerProps = Omit<collapse.Props, 'getRootNode' | 'id'> & { id?: string }

export function useBanner(props: UseBannerProps = {}) {
  const generatedId = useId()
  const { id, ...rest } = props
  const service = useMachine(collapse.machine, {
    id: id ?? generatedId,
    ...rest,
  })
  return collapse.connect(service, normalizeProps)
}
