import * as collapse from '@uswds-tailwind/collapse-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export interface UseBannerProps extends Omit<collapse.Props, 'id' | 'getRootNode'> {}

export function useBanner(props?: UseBannerProps) {
  const service = useMachine(collapse.machine, {
    id: useId(),
    ...props,
  })
  return collapse.connect(service, normalizeProps)
}
