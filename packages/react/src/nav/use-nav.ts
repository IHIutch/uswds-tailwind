import * as modal from '@uswds-tailwind/modal-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'

export interface UseNavProps extends Omit<modal.Props, 'id' | 'getRootNode'> {}

export function useNav(props?: UseNavProps) {
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
