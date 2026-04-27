import * as accordion from '@uswds-tailwind/accordion-compat'

import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'

export type AccordionRootProps = Omit<accordion.Props, 'id'> & React.ComponentPropsWithoutRef<'div'>

export type AccordionItemProps = React.ComponentPropsWithoutRef<'div'> & {
  value: string
}

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<'button'>
export type AccordionContentProps = React.ComponentPropsWithoutRef<'div'>

export type AccordionItemIndicatorProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children?: React.ReactNode | ((context: ReturnType<typeof useAccordionItemContext>) => React.ReactNode)
}

export interface AccordionContextProps {
  api: accordion.Api
}

export interface AccordionItemContextProps {
  value: string
}

const AccordionContext = React.createContext<AccordionContextProps | null>(null)
const AccordionItemContext = React.createContext<AccordionItemContextProps | null>(null)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.Root')
  }
  return context
}

function useAccordionItemContext() {
  const { api } = useAccordionContext()
  const context = React.useContext(AccordionItemContext)

  if (!context) {
    throw new Error('AccordionItem components must be used within an Accordion.Item')
  }
  return {
    value: context.value,
    isOpen: api.getItemState({ value: context.value }).expanded,
  }
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ className, id, ids, multiple, value, defaultValue, onValueChange, ...props }, forwardedRef) => {
    const generatedId = React.useId()
    const service = useMachine(accordion.machine, {
      id: id ?? generatedId,
      ids,
      multiple,
      value,
      defaultValue,
      onValueChange,
    })

    const api = accordion.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <AccordionContext.Provider value={{ api }}>
        <div {...mergedProps} className={cx('space-y-2', className)} ref={forwardedRef} />
      </AccordionContext.Provider>
    )
  },
)

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, forwardedRef) => {
    const { api } = useAccordionContext()
    const mergedProps = mergeProps(api.getItemProps({ value }), props)

    return (
      <AccordionItemContext.Provider value={{ value }}>
        <div {...mergedProps} className={className} ref={forwardedRef} />
      </AccordionItemContext.Provider>
    )
  },
)

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useAccordionContext()
    const { value } = useAccordionItemContext()

    const mergedProps = mergeProps(api.getItemTriggerProps({ value }), props)

    return (
      <button
        {...mergedProps}
        className={cx(
          'group flex items-center w-full py-4 px-5 bg-gray-5 hover:bg-gray-10 font-bold focus:outline-4 focus:outline-blue-40v cursor-pointer text-left gap-3',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useAccordionContext()
    const { value } = useAccordionItemContext()

    const mergedProps = mergeProps(api.getItemContentProps({ value }), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          'py-6 px-4 not-data-[state=open]:hidden',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

function AccordionItemIndicator({ className, children, ...props }: AccordionItemIndicatorProps) {
  const content = typeof children === 'function'
    ? children(useAccordionItemContext())
    : children

  return (
    <div
      className={
        cx('h-full flex items-center ml-auto shrink-0', className)
      }
      {...props}
    >
      {content || <div className="size-6 icon-[material-symbols--add] group-aria-expanded:icon-[material-symbols--remove]" />}
    </div>
  )
}

AccordionRoot.displayName = 'Accordion.Root'
AccordionItem.displayName = 'Accordion.Item'
AccordionItemIndicator.displayName = 'Accordion.ItemIndicator'
AccordionTrigger.displayName = 'Accordion.ItemTrigger'
AccordionContent.displayName = 'Accordion.ItemContent'

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  ItemIndicator: AccordionItemIndicator,
  ItemTrigger: AccordionTrigger,
  ItemContent: AccordionContent,
}
