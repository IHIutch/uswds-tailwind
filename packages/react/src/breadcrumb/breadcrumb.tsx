import * as React from 'react'
import { cx } from '../cva.config'

type BreadcrumbRootProps = React.HTMLAttributes<HTMLDivElement> & BreadcrumbContextProps & {
  'aria-label': string
}
type BreadcrumbListProps = React.HTMLAttributes<HTMLOListElement>
type BreadcrumbItemProps = React.HTMLAttributes<HTMLElement> & BreadcrumbItemContextProps
type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLSpanElement>
type BreadcrumbPreviousProps = React.HTMLAttributes<HTMLSpanElement>

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

function BreadcrumbRoot({ wrap = false, className, separator, previous, ...props }: BreadcrumbRootProps) {
  return (
    <BreadcrumbContext.Provider value={{
      wrap,
      separator,
      previous,
    }}
    >
      <nav {...props} className={cx('@container flex p-1 -mx-1', className)} />
    </BreadcrumbContext.Provider>
  )
}

function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  const { wrap } = useBreadcrumbContext()
  return (
    <ol
      {...props}
      className={
        cx(
          'list-none block',
          wrap ? '' : '@mobile-lg:truncate',
          className,
        )
      }
      aria-label="Breadcrumb"
    />
  )
}

function BreadcrumbItem({ className, children, isCurrent, ...props }: BreadcrumbItemProps) {
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
      >
        {children}
      </li>
    </BreadcrumbItemContext.Provider>
  )
}

function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  const { isCurrent } = useBreadcrumbItemContext()
  const Component = isCurrent ? 'span' : 'a'

  return (
    <Component
      {...props}
      aria-current={isCurrent ? 'page' : undefined} // In USWDS, they place aria-current on the <li>, but per MDN and w3, it is shown on the link
      // aria-disabled={isCurrent ? 'true' : undefined} // This is suggested by React Aria, but not in the USWDS spec
      // role={isCurrent ? 'link' : undefined}
      className={cx(
        isCurrent ? '' : 'text-blue-60v visited:text-violet-70v hover:text-blue-70v focus:outline-4 focus:outline-blue-40v underline',
        className,
      )}
    >
      {children}
    </Component>
  )
}

function BreadcrumbSeparator({ className, children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <span
      aria-hidden="true"
      className="hidden @mobile-lg:inline"
      {...props}
    >
      {children || (
        <span className="icon-[material-symbols--chevron-right] align-middle text-gray-50 size-4"></span>
      )}
    </span>
  )
}

function BreadcrumbPrevious({ className, children, ...props }: BreadcrumbPreviousProps) {
  return (
    <span
      aria-hidden="true"
      className="@mobile-lg:hidden"
      {...props}
    >
      {children || <span className="icon-[material-symbols--arrow-back] align-middle text-gray-50 size-4"></span>}
    </span>
  )
}

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
  Previous: BreadcrumbPrevious,
}
