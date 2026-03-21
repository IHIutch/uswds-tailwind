import type { UsePaginationProps } from './use-pagination'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UsePaginationProps>()([
  'currentPage',
  'pageCount',
  'onPageChange',
])

export const splitProps = createSplitProps<Partial<UsePaginationProps>>(props)

export interface PaginationItemRenderProps extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  value: number
  isActive: boolean
  isLast: boolean
}

interface ItemProps {
  value: number
  render?: (props: PaginationItemRenderProps) => React.ReactNode
}

export const itemProps = createProps<ItemProps>()([
  'value',
  'render',
])

export const splitItemProps = createSplitProps<ItemProps>(itemProps)
