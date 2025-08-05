import type { AccordionProps } from './accordion.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<AccordionProps>()([
  'id',
  'getRootNode',
  'multiple',
])

export const splitProps = createSplitProps<Partial<AccordionProps>>(props)
