import type { CollapseProps } from './collapse.types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

// The parity prop surface. `defaultOpen` re-homes the buggy init markup-read; `open`/`onOpenChange` are the
// net-new controlled escape hatch. NO `disabled`/`dir`/`collapsedHeight`/`collapsedWidth` —
// USWDS banner has no disabled/directional/animation surface.
export const props = createProps<CollapseProps>()([
  'defaultOpen',
  'getRootNode',
  'id',
  'ids',
  'onOpenChange',
  'open',
])

export const splitProps = createSplitProps<Partial<CollapseProps>>(props)
