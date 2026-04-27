import * as tooltip from '@uswds-tailwind/tooltip-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'

// ============================================================================
// Types
// ============================================================================

export type TooltipRootProps = Omit<tooltip.Props, 'id'> & React.ComponentPropsWithoutRef<'div'> & {
  content: string
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
  ({ className, content, position, closeOnEscape, disabled, open, defaultOpen, onOpenChange, ...props }, forwardedRef) => {
    const service = useMachine(tooltip.machine, {
      id: React.useId(),
      position,
      closeOnEscape,
      disabled,
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
          className={cx('relative isolate inline-block', className)}
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
        className={cx(
          'invisible bg-gray-90 rounded-sm text-gray-5 p-2 whitespace-pre z-50 w-auto data-[state=open]:opacity-100 opacity-0 absolute transition-opacity duration-100 ease-in-out left-(--tooltip-left) top-(--tooltip-top) m-(--tooltip-margin)',
          // Caret pseudo-element: positioned by --caret-top/--caret-left from
          // the machine's contentStyle, rotated 45° to form a triangle.
          'after:block after:absolute after:h-2 after:w-2 after:bg-inherit after:rotate-45 after:left-(--caret-left) after:top-(--caret-top)',
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

export interface TooltipProps extends Pick<tooltip.Props, 'position'> {
  content: string
  children?: React.ReactNode
}

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
