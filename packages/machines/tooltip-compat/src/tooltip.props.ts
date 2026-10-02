import type { TooltipProps } from './tooltip.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<TooltipProps>()([
  'defaultOpen',
  'getRootNode',
  'id',
  'ids',
  'onOpenChange',
  'open',
  'placement',
])

export const splitProps = createSplitProps<Partial<TooltipProps>>(props)
