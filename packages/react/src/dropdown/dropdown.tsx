import type { ButtonProps } from '../button'
import * as dropdown from '@uswds-tailwind/dropdown-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { Button } from '../button'
import { cx } from '../cva.config'

export type DropdownRootProps = Omit<dropdown.Props, 'id'> & React.HTMLAttributes<HTMLElement>

export type DropdownTriggerProps = ButtonProps
export type DropdownContentProps = React.HTMLAttributes<HTMLUListElement>
export type DropdownItemProps = React.HTMLAttributes<HTMLLIElement>

export interface DropdownContextProps {
  api: dropdown.Api
}

const DropdownContext = React.createContext<DropdownContextProps | null>(null)

function useDropdownContext() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within a DropdownRoot')
  }
  return context
}

const DropdownRoot = React.forwardRef<any, DropdownRootProps>(
  ({ className, ...props }, forwardedRef) => {
    const service = useMachine(dropdown.machine, {
      id: React.useId(),
      ...props,
    })

    const api = dropdown.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <DropdownContext.Provider value={{ api }}>
        <div {...mergedProps} ref={forwardedRef} className={cx('relative', className)} />
      </DropdownContext.Provider>
    )
  },
)

const DropdownTrigger = React.forwardRef<any, DropdownTriggerProps>(
  (props, forwardedRef) => {
    const { api } = useDropdownContext()

    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <Button
        {...mergedProps}
        ref={forwardedRef}
      />
    )
  },
)

const DropdownContent = React.forwardRef<any, DropdownContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDropdownContext()

    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <ul
        {...mergedProps}
        className={cx(
          'bg-blue-warm-80v w-60 z-30 absolute',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const DropdownItem = React.forwardRef<any, DropdownItemProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useDropdownContext()

    const mergedProps = mergeProps(api.getItemProps(), props)

    return (
      <li
        {...mergedProps}
        className={cx(
          'focus:outline-4 border-t border-t-gray-cool-10 focus:-outline-offset-4 focus:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const DropdownLink = React.forwardRef<any, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx(
          'text-decoration-none block hover:underline text-white p-2 focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Link: DropdownLink,
}
