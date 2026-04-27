import type { TooltipProps } from './tooltip.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<TooltipProps>()([
  'id',
  'ids',
  'getRootNode',
  'position',
  'closeOnEscape',
  'disabled',
  'open',
  'defaultOpen',
  'onOpenChange',
])

export const splitProps = createSplitProps<Partial<TooltipProps>>(props)
