import * as React from 'react'
import { cx } from '../cva.config'

type PageSlot = { type: 'page', value: number } | { type: 'ellipsis' }

interface PaginationContextProps {
  currentPage: number
  pageCount?: number
  onPageChange: (page: number) => void
  pages: PageSlot[]
}

const PaginationContext = React.createContext<PaginationContextProps | null>(null)

function usePaginationContext() {
  const context = React.useContext(PaginationContext)
  if (!context) {
    throw new Error('Pagination components must be used within a Pagination.Root')
  }
  return context
}

type PaginationRootProps = React.ComponentPropsWithoutRef<'nav'> & {
  currentPage?: number
  pageCount?: number
  onPageChange?: (page: number) => void
}

function PaginationRoot({ currentPage: currentPageProp = 1, pageCount, onPageChange, className, children, ...props }: PaginationRootProps) {
  const [uncontrolledPage, setUncontrolledPage] = React.useState(currentPageProp)
  const isControlled = onPageChange !== undefined
  const currentPage = isControlled ? currentPageProp : uncontrolledPage

  const handlePageChange = React.useCallback((page: number) => {
    if (!isControlled) {
      setUncontrolledPage(page)
    }
    onPageChange?.(page)
  }, [isControlled, onPageChange])

  const pages = getPages(currentPage, pageCount)

  return (
    <PaginationContext.Provider value={{ currentPage, pageCount, onPageChange: handlePageChange, pages }}>
      <nav
        aria-label="Pagination"
        {...props}
        className={cx('@container flex justify-center', className)}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  )
}

type PaginationListProps = Omit<React.ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ((context: { pages: PageSlot[] }) => React.ReactNode) | React.ReactNode
}

function PaginationList({
  className,
  children,
  ...props
}: PaginationListProps) {
  const { pages } = usePaginationContext()

  return (
    <ul
      {...props}
      className={cx('flex space-x-2 *:inline-flex *:[data-prev]:hidden *:[data-prev]:@tablet:inline-flex *:[data-next]:hidden *:[data-next]:@tablet:inline-flex', className)}
    >
      {typeof children === 'function' ? children({ pages }) : children}
    </ul>
  )
}

function PaginationPrevTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  const { currentPage, onPageChange } = usePaginationContext()

  if (currentPage === 1)
    return null

  return (
    <li data-prev>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        {...props}
        className={cx(
          'h-10 pr-2 mr-3 cursor-pointer inline-flex items-center text-blue-60v hover:underline hover:text-blue-warm-70v focus:underline focus:text-blue-warm-70v focus:outline-4 focus:outline-blue-40v',
          className,
        )}
      >
        {children ?? (
          <>
            <span aria-hidden="true" className="icon-[material-symbols--chevron-left] align-middle size-4" />
            Previous
          </>
        )}
      </button>
    </li>
  )
}

function PaginationNextTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  const { currentPage, pageCount, onPageChange } = usePaginationContext()

  if (pageCount !== undefined && currentPage === pageCount)
    return null

  return (
    <li data-next>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        {...props}
        className={cx(
          'h-10 pl-2 ml-3 cursor-pointer inline-flex items-center text-blue-60v hover:underline hover:text-blue-warm-70v focus:underline focus:text-blue-warm-70v focus:outline-4 focus:outline-blue-40v',
          className,
        )}
      >
        {children ?? (
          <>
            Next
            <span aria-hidden="true" className="icon-[material-symbols--chevron-right] align-middle size-4" />
          </>
        )}
      </button>
    </li>
  )
}

export interface PaginationItemRenderProps {
  'value': number
  'isActive': boolean
  'isLast': boolean
  'className': string
  'aria-label': string
  'aria-current': 'page' | undefined
}

type PaginationItemProps = {
  value: number
  render?: (props: PaginationItemRenderProps) => React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>

function PaginationItem({ value, render, className, ...props }: PaginationItemProps) {
  const { currentPage, pageCount, onPageChange } = usePaginationContext()
  const isActive = value === currentPage
  const isLast = pageCount !== undefined && value === pageCount
  const ariaLabel = isLast ? `Last page, page ${value}` : `Page ${value}`
  const ariaCurrent = isActive ? 'page' as const : undefined
  const mergedClassName = cx(
    'h-10 min-w-10 p-2 cursor-pointer w-full flex rounded border border-gray-90/20 text-blue-60v justify-center items-center hover:text-blue-warm-70v hover:border-blue-warm-70v focus:text-blue-warm-70v focus:border-blue-warm-70v focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v aria-[current=page]:bg-gray-90 aria-[current=page]:text-white',
    className,
  )

  return (
    <li data-page={value}>
      {render
        ? render({ value, isActive, isLast, 'className': mergedClassName, 'aria-label': ariaLabel, 'aria-current': ariaCurrent })
        : (
            <button
              type="button"
              onClick={() => onPageChange(value)}
              aria-label={ariaLabel}
              aria-current={ariaCurrent}
              {...props}
              className={mergedClassName}
            >
              {value}
            </button>
          )}
    </li>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      data-ellipsis
      aria-label="ellipsis indicating non-visible pages"
      {...props}
    >
      <div className={cx('h-10 w-10 flex items-center justify-center', className)}>...</div>
    </li>
  )
}

function PaginationPages({ render }: { render?: PaginationItemProps['render'] }) {
  const { pages } = usePaginationContext()

  return pages.map((page, i) =>
    page.type === 'page'
      ? <PaginationItem key={page.value} value={page.value} render={render} />
      : <PaginationEllipsis key={`ellipsis-${i}`} />,
  )
}

export type { PageSlot }

export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  PrevTrigger: PaginationPrevTrigger,
  NextTrigger: PaginationNextTrigger,
  Item: PaginationItem,
  Ellipsis: PaginationEllipsis,
  Pages: PaginationPages,
}

function getPages(currentPage: number, pageCount?: number): PageSlot[] {
  // Unbounded: always overflow in slot 7, slot 4 = current for pages 4+
  if (pageCount === undefined) {
    const start = currentPage < 4 ? 1 : currentPage - 3
    return [
      ...Array.from({ length: 6 }, (_, i) => ({ type: 'page' as const, value: start + i })),
      { type: 'ellipsis' as const },
    ]
  }

  // Bounded with 7 or fewer pages: show all, no overflow
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => ({ type: 'page' as const, value: i + 1 }))
  }

  // Bounded with 8+ pages: 7 slots, overflow only in slot 2 and/or slot 6
  // Near start: show pages 1–5, overflow in slot 6, last page in slot 7
  if (currentPage <= 4) {
    return [
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'ellipsis' },
      { type: 'page', value: pageCount },
    ]
  }

  // Near end: page 1 in slot 1, overflow in slot 2, last 5 pages in slots 3–7
  if (currentPage >= pageCount - 3) {
    return [
      { type: 'page', value: 1 },
      { type: 'ellipsis' },
      { type: 'page', value: pageCount - 4 },
      { type: 'page', value: pageCount - 3 },
      { type: 'page', value: pageCount - 2 },
      { type: 'page', value: pageCount - 1 },
      { type: 'page', value: pageCount },
    ]
  }

  // Middle: page 1, overflow, current-1/current/current+1, overflow, last page
  return [
    { type: 'page', value: 1 },
    { type: 'ellipsis' },
    { type: 'page', value: currentPage - 1 },
    { type: 'page', value: currentPage },
    { type: 'page', value: currentPage + 1 },
    { type: 'ellipsis' },
    { type: 'page', value: pageCount },
  ]
}
