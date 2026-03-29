import * as React from 'react'
import { cx } from '../cva.config'

export type BreadcrumbRootProps = React.ComponentPropsWithoutRef<'div'> & BreadcrumbContextProps & {
  'aria-label': string
}
export type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>
export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'> & BreadcrumbItemContextProps
export type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'span'>
export type BreadcrumbPreviousProps = React.ComponentPropsWithoutRef<'span'>

interface BreadcrumbContextProps {
  wrap: boolean
  separator?: React.ReactNode
  previous?: React.ReactNode
}

interface BreadcrumbItemContextProps {
  isCurrent?: boolean
}

const BreadcrumbContext = React.createContext<BreadcrumbContextProps | null>(null)
const BreadcrumbItemContext = React.createContext<BreadcrumbItemContextProps | null>(null)

function useBreadcrumbContext() {
  const context = React.useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('Breadcrumb components must be used within a Breadcrumb.Root')
  }
  return context
}

function useBreadcrumbItemContext() {
  const context = React.useContext(BreadcrumbItemContext)
  if (!context) {
    throw new Error('Breadcrumb components must be used within a Breadcrumb.Root')
  }
  return context
}

const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbRootProps>(
  ({ wrap = false, className, separator, previous, ...props }, forwardedRef) => {
    return (
      <BreadcrumbContext.Provider value={{ wrap, separator, previous }}>
        <nav {...props} className={cx('@container flex p-1 -mx-1', className)} ref={forwardedRef} />
      </BreadcrumbContext.Provider>
    )
  },
)

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, forwardedRef) => {
    const { wrap } = useBreadcrumbContext()
    return (
      <ol
        {...props}
        className={cx('list-none block', wrap ? '' : '@mobile-lg:truncate', className)}
        aria-label="Breadcrumb"
        ref={forwardedRef}
      />
    )
  },
)

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children, isCurrent, ...props }, forwardedRef) => {
    const { wrap } = useBreadcrumbContext()
    return (
      <BreadcrumbItemContext.Provider value={{ isCurrent }}>
        <li
          {...props}
          className={cx(
            wrap ? 'inline-block' : 'inline-flex @mobile-lg:inline',
            '@mobile-lg:whitespace-nowrap @max-mobile-lg:not-nth-last-[2]:sr-only', // USWDS uses sr-only styles here, but this causes earlier elements to still be tabbable
            className,
          )}
          ref={forwardedRef}
        >
          {children}
        </li>
      </BreadcrumbItemContext.Provider>
    )
  },
)

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { isCurrent } = useBreadcrumbItemContext()
    const Component = isCurrent ? 'span' : 'a'
    return (
      <Component
        {...props}
        aria-current={isCurrent ? 'page' : undefined} // In USWDS, they place aria-current on the <li>, but per MDN and w3, it is shown on the link
        className={cx(
          isCurrent ? '' : 'text-blue-60v visited:text-violet-70v hover:text-blue-70v focus:outline-4 focus:outline-blue-40v underline',
          className,
        )}
        ref={forwardedRef}
      >
        {children}
      </Component>
    )
  },
)

const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <span
        aria-hidden="true"
        className="hidden @mobile-lg:inline"
        {...props}
        ref={forwardedRef}
      >
        {children || (
          <span className="icon-[material-symbols--chevron-right] align-middle text-gray-50 size-4"></span>
        )}
      </span>
    )
  },
)

const BreadcrumbPrevious = React.forwardRef<HTMLSpanElement, BreadcrumbPreviousProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <span
        aria-hidden="true"
        className="@mobile-lg:hidden"
        {...props}
        ref={forwardedRef}
      >
        {children || <span className="icon-[material-symbols--arrow-back] align-middle text-gray-50 size-4"></span>}
      </span>
    )
  },
)

BreadcrumbRoot.displayName = 'Breadcrumb.Root'
BreadcrumbList.displayName = 'Breadcrumb.List'
BreadcrumbItem.displayName = 'Breadcrumb.Item'
BreadcrumbLink.displayName = 'Breadcrumb.Link'
BreadcrumbSeparator.displayName = 'Breadcrumb.Separator'
BreadcrumbPrevious.displayName = 'Breadcrumb.Previous'

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
  Previous: BreadcrumbPrevious,
}
