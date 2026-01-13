import * as React from 'react'
import { cx } from '../cva.config'

type BreadcrumbRootProps = React.HTMLAttributes<HTMLDivElement> & BreadcrumbContextProps

interface BreadcrumbContextProps {
  wrap: boolean
}

const BreadcrumbContext = React.createContext<BreadcrumbContextProps | null>(null)

function useBreadcrumbContext() {
  const context = React.useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('Breadcrumb components must be used within a BreadcrumbRoot')
  }
  return context
}

function BreadcrumbRoot({ wrap = false, className, ...props }: BreadcrumbRootProps) {
  return (
    <BreadcrumbContext.Provider value={{ wrap }}>
      <nav {...props} className={cx('@container block', className)} />
    </BreadcrumbContext.Provider>
  )
}

function BreadcrumbList({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { wrap } = useBreadcrumbContext()
  return (
    <ol
      {...props}
      className={
        cx(
          'list-none p-2 -mx-1 block',
          wrap ? '' : '@mobile-lg:truncate',
          className,
        )
      }
      aria-label="Breadcrumb"
    />
  )
}

function BreadcrumbItem({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { wrap } = useBreadcrumbContext()

  return (
    <li
      {...props}
      className={cx(
        wrap ? 'inline-block' : 'inline-flex @mobile-lg:inline',
        '@mobile-lg:whitespace-nowrap @max-mobile-lg:not-nth-last-[2]:sr-only', // USWDS uses sr-only styles here, but this causes earlier elements to still be tabbable
        className,
      )}
    >
      <span aria-hidden="true" className="@mobile-lg:hidden">
        <span className="icon-[material-symbols--arrow-back] align-middle text-gray-50 size-4"></span>
      </span>
      {children}
    </li>
  )
}

type BreadcrumbLinkProps = {
  isCurrent?: false
} & React.AnchorHTMLAttributes<HTMLAnchorElement>
| {
  isCurrent: true
} & React.HTMLAttributes<HTMLSpanElement>

function BreadcrumbLink({ className, children, isCurrent, ...props }: BreadcrumbLinkProps) {
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

function BreadcrumbSeparator({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
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

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
}
