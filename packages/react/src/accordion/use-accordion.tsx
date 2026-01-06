import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export interface UseAccordionProps extends Omit<accordion.Props, 'getRootNode'> { }

export function useAccordion(props?: UseAccordionProps) {
  const machineProps: accordion.Props = {
    id: useId(),
    ...props,
  }

  const service = useMachine(accordion.machine, machineProps)
  return accordion.connect(service, normalizeProps)
}
