import type { PageSlot, UsePaginationProps, UsePaginationReturn } from './use-pagination'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { splitProps } from './pagination.props'
import { usePagination } from './use-pagination'

const PaginationContext = React.createContext<UsePaginationReturn | null>(null)

function usePaginationContext() {
  const context = React.useContext(PaginationContext)
  if (!context) {
    throw new Error('Pagination components must be used within a Pagination.Root')
  }
  return context
}

export type PaginationRootProps = React.ComponentPropsWithoutRef<'nav'> & UsePaginationProps

function PaginationRoot(props: PaginationRootProps) {
  const [rootProps, localProps] = splitProps(props)
  const pagination = usePagination(rootProps)

  const mergedProps = mergeProps(pagination.getRootProps(), localProps)

  return (
    <PaginationContext.Provider value={pagination}>
      <nav
        {...mergedProps}
        className={cx('@container flex justify-center', localProps.className)}
      >
        {localProps.children}
      </nav>
    </PaginationContext.Provider>
  )
}

export type PaginationListProps = Omit<React.ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ((context: { pages: PageSlot[] }) => React.ReactNode) | React.ReactNode
}

function PaginationList({
  className,
  children,
  ...props
}: PaginationListProps) {
  const { pages, getListProps } = usePaginationContext()

  const mergedProps = mergeProps(getListProps(), props)

  return (
    <ul
      {...mergedProps}
      className={cx('flex gap-2 *:inline-flex *:has-data-[part=prev-trigger]:hidden *:has-data-[part=prev-trigger]:@tablet:inline-flex *:has-data-[part=next-trigger]:hidden *:has-data-[part=next-trigger]:@tablet:inline-flex', className)}
    >
      {typeof children === 'function' ? children({ pages }) : children}
    </ul>
  )
}

function PaginationPrevTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  const { currentPage, isFirstPage, getPrevTriggerProps } = usePaginationContext()

  if (isFirstPage(currentPage))
    return null

  const mergedProps = mergeProps(getPrevTriggerProps(), props)

  return (
    <li>
      <button
        {...mergedProps}
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
  const { currentPage, isLastPage, getNextTriggerProps } = usePaginationContext()

  if (isLastPage(currentPage))
    return null

  const mergedProps = mergeProps(getNextTriggerProps(), props)

  return (
    <li>
      <button
        {...mergedProps}
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

export interface PaginationItemRenderProps extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  value: number
  isActive: boolean
  isLast: boolean
}

export type PaginationItemProps = {
  value: number
  render?: (props: PaginationItemRenderProps) => React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>

function PaginationItem({ className, value, render, ...props }: PaginationItemProps) {
  const { isLastPage, isActivePage, getItemProps } = usePaginationContext()
  const mergedClassName = cx(
    'h-10 min-w-10 p-2 cursor-pointer w-full flex rounded border border-gray-90/20 text-blue-60v justify-center items-center hover:text-blue-warm-70v hover:border-blue-warm-70v focus:text-blue-warm-70v focus:border-blue-warm-70v focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v aria-[current=page]:bg-gray-90 aria-[current=page]:text-white',
    className,
  )

  const mergedProps = mergeProps(getItemProps({ value }), props)

  return (
    <li>
      {render
        ? render({
            value,
            isActive: isActivePage(value),
            isLast: isLastPage(value),
            ...mergedProps,
            className: mergedClassName,
          })
        : (
            <button
              {...mergedProps}
              className={mergedClassName}
            >
              {value}
            </button>
          )}
    </li>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<'li'>) {
  const { getEllipsisProps } = usePaginationContext()

  const mergedProps = mergeProps(getEllipsisProps(), props)

  return (
    <li
      {...mergedProps}
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

PaginationRoot.displayName = 'Pagination.Root'
PaginationList.displayName = 'Pagination.List'
PaginationPrevTrigger.displayName = 'Pagination.PrevTrigger'
PaginationNextTrigger.displayName = 'Pagination.NextTrigger'
PaginationItem.displayName = 'Pagination.Item'
PaginationEllipsis.displayName = 'Pagination.Ellipsis'
PaginationPages.displayName = 'Pagination.Pages'

export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  PrevTrigger: PaginationPrevTrigger,
  NextTrigger: PaginationNextTrigger,
  Item: PaginationItem,
  Ellipsis: PaginationEllipsis,
  Pages: PaginationPages,
}
