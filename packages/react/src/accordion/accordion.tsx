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

function AccordionRoot({ children, ...props }: AccordionRootProps) {
  const service = useMachine(accordion.machine, {
    id: React.useId(),
    multiple: props.multiple,
  })

  const api = accordion.connect(service, normalizeProps)

  return (
    <AccordionContext.Provider value={{ api }}>
      <div {...api.getRootProps()} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({ value, children, ...props }: AccordionItemProps) {
  const { api } = useAccordionContext()

  return (
    <div {...api.getItemProps({ value })} {...props}>
      {children}
    </div>
  )
}

function AccordionTrigger({ value, children, ...props }: AccordionTriggerProps) {
  const { api } = useAccordionContext()

  return (
    <button {...api.getTriggerProps({ value })} {...props}>
      {children}
    </button>
  )
}

function AccordionContent({ value, children, ...props }: AccordionContentProps) {
  const { api } = useAccordionContext()

  return (
    <div {...api.getContentProps({ value })} {...props}>
      {children}
    </div>
  )
}

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
