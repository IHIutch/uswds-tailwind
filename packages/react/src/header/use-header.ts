import * as collapse from '@uswds-tailwind/collapse-compat'
import * as modal from '@uswds-tailwind/modal-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'

export interface UseHeaderProps extends Omit<modal.Props, 'id' | 'getRootNode'> {}

export function useHeader(props?: UseHeaderProps) {
  const service = useMachine(modal.machine, {
    id: React.useId(),
    ...props,
  })
  const api = modal.connect(service, normalizeProps)

  // Auto-close when resizing to desktop — releases focus trap, scroll lock, aria-modal
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => {
      if (mq.matches && api.open) {
        service.send({ type: 'CLOSE' })
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [api, service])

  return api
}

export interface UseHeaderNavDropdownProps extends Omit<collapse.Props, 'id' | 'getRootNode'> {}

export function useHeaderNavMenu(props?: UseHeaderNavDropdownProps) {
  const service = useMachine(collapse.machine, {
    id: React.useId(),
    ...props,
  })
  return collapse.connect(service, normalizeProps)
}
