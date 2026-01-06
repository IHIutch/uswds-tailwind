import type { ReactNode } from 'react'
import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import React from 'react'

export interface AccordionRootProps extends Omit<accordion.Props, 'id'> {
  className?: string
  children: ReactNode
}

export interface AccordionItemProps {
  className?: string
  value: string
  children: ReactNode
}

export interface AccordionTriggerProps {
  className?: string
  value: string
  children: ReactNode
}

export interface AccordionContentProps {
  className?: string
  value: string
  children: ReactNode
}

export interface AccordionContextProps {
  api: accordion.Api
}

const AccordionContext = React.createContext<AccordionContextProps | null>(null)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an AccordionRoot')
  }
  return context
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ children, ...props }, ref) => {
    const service = useMachine(accordion.machine, {
      id: React.useId(),
      multiple: props.multiple,
    })

    const api = accordion.connect(service, normalizeProps)

    return (
      <AccordionContext.Provider value={{ api }}>
        <div {...api.getRootProps()} ref={ref} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, ...props }, ref) => {
    const { api } = useAccordionContext()

    return (
      <div {...api.getItemProps({ value })} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ value, children, ...props }, ref) => {
    const { api } = useAccordionContext()

    return (
      <button {...api.getTriggerProps({ value })} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ value, children, ...props }, ref) => {
    const { api } = useAccordionContext()

    return (
      <div {...api.getContentProps({ value })} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

AccordionRoot.displayName = 'AccordionRoot'
AccordionItem.displayName = 'AccordionItem'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionContent.displayName = 'AccordionContent'

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}
