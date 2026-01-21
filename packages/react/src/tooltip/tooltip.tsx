import * as tooltip from '@uswds-tailwind/tooltip-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'

// ============================================================================
// Types
// ============================================================================

export type TooltipRootProps = Omit<tooltip.Props, 'id'> & React.HTMLAttributes<HTMLElement>
export type TooltipTriggerProps = React.HTMLAttributes<HTMLElement>
export type TooltipContentProps = React.HTMLAttributes<HTMLDivElement>

export interface TooltipContextProps {
  api: tooltip.Api
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
  ({ className, ...props }, forwardedRef) => {
    const service = useMachine(tooltip.machine, {
      id: React.useId(),
      content: props.content,
      placement: props.placement,
    })

    const api = tooltip.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <TooltipContext.Provider value={{ api }}>
        <div
          {...mergedProps}
          className={cx('relative isolate', className)}
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
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useTooltipContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          'bg-gray-90 rounded-sm text-gray-5 p-2 whitespace-pre z-50 w-auto data-[state=open]:opacity-100 opacity-0 absolute transition-opacity duration-100 ease-in-out after:block after:absolute after:h-2 after:w-2 after:bg-inherit after:rotate-45 after:translate-(--caret-translate) after:left-(--caret-left) after:top-(--caret-top)',
          className,
        )}
        ref={forwardedRef}
      >
        {api.getContent()}
      </div>
    )
  },
)

export type TooltipProps = React.PropsWithChildren & Pick<tooltip.Props, 'content' | 'placement'>

export function Tooltip({ content, placement, children, ...props }: TooltipProps) {
  return (
    <TooltipRoot content={content} placement={placement} {...props}>
      <TooltipTrigger>
        {children}
      </TooltipTrigger>
      <TooltipContent />
    </TooltipRoot>
  )
}
