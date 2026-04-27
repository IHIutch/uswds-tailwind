import type { UsePaginationProps } from './use-pagination'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UsePaginationProps>()([
  'currentPage',
  'pageCount',
  'onPageChange',
])

export const splitProps = createSplitProps<Partial<UsePaginationProps>>(props)
