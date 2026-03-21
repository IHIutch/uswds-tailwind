import * as React from 'react'
import { parts } from './pagination.anatomy'

export type PageSlot = { type: 'page', value: number } | { type: 'ellipsis' }

export interface UsePaginationProps {
  currentPage?: number
  pageCount?: number
  onPageChange?: (page: number) => void
}

export type UsePaginationReturn = ReturnType<typeof usePagination>

export function usePagination(props: UsePaginationProps = {}) {
  const { pageCount, onPageChange } = props

  const [uncontrolledPage, setUncontrolledPage] = React.useState(props.currentPage ?? 1)
  const isControlled = onPageChange !== undefined
  const currentPage = isControlled ? (props.currentPage ?? 1) : uncontrolledPage

  const setPage = React.useCallback((page: number) => {
    if (!isControlled) {
      setUncontrolledPage(page)
    }
    onPageChange?.(page)
  }, [isControlled, onPageChange])

  const pages = getPages(currentPage, pageCount)

  const isFirstPage = currentPage === 1
  const isLastPage = pageCount !== undefined && currentPage === pageCount

  const getRootProps = React.useMemo(
    () => () => ({
      ...parts.root.attrs,
      'aria-label': 'Pagination',
    }) as React.HTMLAttributes<HTMLElement>,
    [],
  )

  const getListProps = React.useMemo(
    () => () => ({
      ...parts.list.attrs,
    }) as React.HTMLAttributes<HTMLUListElement>,
    [],
  )

  const getPrevTriggerProps = React.useMemo(
    () => () => ({
      ...parts.prevTrigger.attrs,
      onClick: () => setPage(currentPage - 1),
    }) as React.ButtonHTMLAttributes<HTMLButtonElement>,
    [currentPage, setPage],
  )

  const getNextTriggerProps = React.useMemo(
    () => () => ({
      ...parts.nextTrigger.attrs,
      onClick: () => setPage(currentPage + 1),
    }) as React.ButtonHTMLAttributes<HTMLButtonElement>,
    [currentPage, setPage],
  )

  const getItemProps = React.useMemo(
    () => (value: number) => {
      const isActive = value === currentPage
      const isLast = pageCount !== undefined && value === pageCount
      return {
        ...parts.item.attrs,
        'type': 'button' as const,
        'aria-label': isLast ? `Last page, page ${value}` : `Page ${value}`,
        'aria-current': isActive ? 'page' as const : undefined,
        'onClick': () => setPage(value),
      } as React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
    },
    [currentPage, pageCount, setPage],
  )

  const getEllipsisProps = React.useMemo(
    () => () => ({
      ...parts.ellipsis.attrs,
      'aria-label': 'ellipsis indicating non-visible pages',
    }) as React.HTMLAttributes<HTMLLIElement>,
    [],
  )

  return {
    currentPage,
    pageCount,
    pages,
    isFirstPage,
    isLastPage,
    setPage,
    getRootProps,
    getListProps,
    getPrevTriggerProps,
    getNextTriggerProps,
    getItemProps,
    getEllipsisProps,
  }
}

function getPages(currentPage: number, pageCount?: number): PageSlot[] {
  if (pageCount === undefined) {
    const start = currentPage < 4 ? 1 : currentPage - 3
    return [
      ...Array.from({ length: 6 }, (_, i) => ({ type: 'page' as const, value: start + i })),
      { type: 'ellipsis' as const },
    ]
  }

  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => ({ type: 'page' as const, value: i + 1 }))
  }

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
