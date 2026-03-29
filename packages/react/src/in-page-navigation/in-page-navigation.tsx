import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { cx } from '../cva.config'
import { useScrollspy } from './use-scrollspy'

// ============================================================================
// Types
// ============================================================================

export interface InPageNavHeading {
  href: `#${string}`
  label: string
  depth: 1 | 2 | 3 | 4 | 5 | 6
}

export type InPageNavRootProps = React.ComponentPropsWithoutRef<'nav'> & {
  headings: InPageNavHeading[]
  activeHref?: string
  onActiveChange?: (href: string) => void
}

export interface InPageNavContextProps extends Pick<InPageNavRootProps, 'headings'> {
  activeHref: string | null
  setActiveHref: (href: string) => void
  leastHeadingDepth: number
}

export type InPageNavHeadingProps = React.HTMLAttributes<HTMLDivElement>

export type InPageNavListContext = Pick<InPageNavContextProps, 'headings' | 'activeHref'>

export type InPageNavListProps = Omit<React.ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children: ((context: InPageNavListContext) => React.ReactNode) | React.ReactNode
}

export type InPageNavItemProps = React.ComponentPropsWithoutRef<'li'>

export type InPageNavLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  href: string
  depth?: number
}

export interface InPageNavScrollspyProps {
  root?: React.RefObject<Element | null>
  options?: Omit<IntersectionObserverInit, 'root'>
}

// ============================================================================
// Context
// ============================================================================

const InPageNavContext = React.createContext<InPageNavContextProps | null>(null)

function useInPageNavContext() {
  const context = React.useContext(InPageNavContext)
  if (!context) {
    throw new Error('InPageNav components must be used within an InPageNav.Root')
  }
  return context
}

// ============================================================================
// Root
// ============================================================================

function InPageNavRoot({
  headings,
  children,
  activeHref,
  onActiveChange,
  className,
  ...props
}: InPageNavRootProps) {
  const [internalActiveHref, setInternalActiveHref] = React.useState(activeHref || null)

  const setActiveHref = React.useCallback((href: string) => {
    setInternalActiveHref(href)
    onActiveChange?.(href)
  }, [onActiveChange])

  const leastHeadingDepth = Math.min(...headings.map(h => h.depth || Infinity))

  return (
    <InPageNavContext.Provider value={{
      headings,
      activeHref: internalActiveHref,
      setActiveHref,
      leastHeadingDepth,
    }}
    >
      <nav
        aria-label="On this page"
        {...props}
        className={cx('', className)}
      >
        {children}
      </nav>
    </InPageNavContext.Provider>
  )
}

// ============================================================================
// Heading
// ============================================================================

function InPageNavHeadingElement({ className, ...props }: InPageNavHeadingProps) {
  return (
    <div
      {...props}
      className={cx('text-sm font-bold mb-4 text-black', className)}
    />
  )
}

// ============================================================================
// List
// ============================================================================

function InPageNavList({ className, children, ...props }: InPageNavListProps) {
  const { headings, activeHref } = useInPageNavContext()

  return (
    <ul
      {...props}
      className={cx('border-l border-l-gray-10', className)}
    >
      {typeof children === 'function' ? children({ headings, activeHref }) : children}
    </ul>
  )
}

// ============================================================================
// Item
// ============================================================================

function InPageNavItem({ className, ...props }: InPageNavItemProps) {
  return (
    <li {...props} className={cx(className)} />
  )
}

// ============================================================================
// Link
// ============================================================================

function InPageNavLink({ href, depth = Infinity, className, children, ...props }: InPageNavLinkProps) {
  const { activeHref, leastHeadingDepth } = useInPageNavContext()

  const isActive = activeHref === href
  const isPrimary = leastHeadingDepth < Infinity && depth === leastHeadingDepth

  return (
    <a
      {...props}
      href={href}
      data-active={dataAttr(isActive)}
      data-depth={depth}
      data-primary={dataAttr(isPrimary)}
      className={cx(
        'relative block py-2 px-4 text-sm leading-tight text-blue-60v focus:outline-4 focus:outline-blue-40v focus:outline-offset-0 hover:underline data-active:text-black data-active:after:block data-active:after:w-1 data-active:after:bg-black data-active:after:top-0 data-active:after:-bottom-px data-active:after:left-0 data-active:after:absolute data-primary:font-bold',
        className,
      )}
    >
      {children}
    </a>
  )
}

// ============================================================================
// Scrollspy
// ============================================================================

function InPageNavScrollspy({ root, options }: InPageNavScrollspyProps) {
  const { headings, setActiveHref } = useInPageNavContext()
  const hrefs = React.useMemo(() => headings.map(h => h.href), [headings])

  useScrollspy({
    hrefs,
    options: {
      ...options,
      root: root?.current ?? null,
    },
    onIntersect: setActiveHref,
  })

  return null
}

// ============================================================================
// Items (convenience)
// ============================================================================

function InPageNavItems() {
  const { headings } = useInPageNavContext()
  return headings.map(heading => (
    <InPageNavItem key={heading.href}>
      <InPageNavLink href={heading.href} depth={heading.depth}>
        {heading.label}
      </InPageNavLink>
    </InPageNavItem>
  ))
}

// ============================================================================
// Export
// ============================================================================

InPageNavRoot.displayName = 'InPageNav.Root'
InPageNavHeadingElement.displayName = 'InPageNav.Heading'
InPageNavList.displayName = 'InPageNav.List'
InPageNavItem.displayName = 'InPageNav.Item'
InPageNavLink.displayName = 'InPageNav.Link'
InPageNavScrollspy.displayName = 'InPageNav.Scrollspy'
InPageNavItems.displayName = 'InPageNav.Items'

export const InPageNav = {
  Root: InPageNavRoot,
  Heading: InPageNavHeadingElement,
  List: InPageNavList,
  Item: InPageNavItem,
  Link: InPageNavLink,
  Scrollspy: InPageNavScrollspy,
  Items: InPageNavItems,
}
