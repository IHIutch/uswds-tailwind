import * as tooltip from '@uswds-tailwind/tooltip-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cn } from '../tv.config'

// ============================================================================
// Types
// ============================================================================

export type TooltipRootProps = Omit<tooltip.Props, 'id' | 'placement'> & React.ComponentPropsWithoutRef<'div'> & {
  content: string
  position?: tooltip.Placement
}
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<'div'>
export type TooltipContentProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>

export interface TooltipContextProps {
  api: tooltip.Api
  content: string
}

// ============================================================================
// Context & Hooks
// ============================================================================

const TooltipContext = React.createContext<TooltipContextProps | null>(null)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip.Root')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

const TooltipRoot = React.forwardRef<HTMLDivElement, TooltipRootProps>(
  ({ className, id, ids, content, position, open, defaultOpen, onOpenChange, ...props }, forwardedRef) => {
    const generatedId = React.useId()
    const service = useMachine(tooltip.machine, {
      id: id ?? generatedId,
      ids,
      placement: position,
      open,
      defaultOpen,
      onOpenChange,
    })

    const api = tooltip.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <TooltipContext.Provider value={{ api, content }}>
        <div
          {...mergedProps}
          className={cn('relative isolate inline-block', className)}
          ref={forwardedRef}
        />
      </TooltipContext.Provider>
    )
  },
)

function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  const { api } = useTooltipContext()
  const mergedProps = mergeProps(api.getTriggerProps(), props)

  // asChild pattern
  const child = React.Children.only(children) as React.ReactElement

  if (React.isValidElement(child)) {
    return React.cloneElement(child, mergedProps as any)
  }

  return null
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api, content } = useTooltipContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <div
        {...mergedProps}
        className={cn(
          'invisible bg-gray-90 rounded-sm text-gray-5 p-2 whitespace-pre z-50 w-auto data-[state=open]:opacity-100 opacity-0 absolute top-(--tooltip-y) left-(--tooltip-x) transition-opacity duration-100 ease-in-out',
          'after:block after:absolute after:size-2 after:bg-inherit after:transform-(--arrow-transform) after:translate-x-(--arrow-offset) after:translate-y-(--arrow-offset) after:left-(--arrow-x) after:top-(--arrow-y)',
          'data-visible:visible',
          className,
        )}
        ref={forwardedRef}
      >
        {content}
      </div>
    )
  },
)

TooltipRoot.displayName = 'Tooltip.Root'
TooltipTrigger.displayName = 'Tooltip.Trigger'
TooltipContent.displayName = 'Tooltip.Content'

export type TooltipProps = TooltipRootProps

export function Tooltip({ content, position, children, ...props }: TooltipProps) {
  return (
    <TooltipRoot content={content} position={position} {...props}>
      <TooltipTrigger>
        {children}
      </TooltipTrigger>
      <TooltipContent />
    </TooltipRoot>
  )
}
