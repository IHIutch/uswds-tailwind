import type { AccordionProps, ItemProps } from './accordion.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<AccordionProps>()([
  'defaultValue',
  'getRootNode',
  'id',
  'ids',
  'multiple',
  'onValueChange',
  'value',
])
export const splitProps = createSplitProps<Partial<AccordionProps>>(props)

export const itemProps = createProps<ItemProps>()(['value'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
