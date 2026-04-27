import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

export type ElementIds = Partial<{
  root: string
  content: string
  trigger: string
}>

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export interface CollapseProps extends CommonProperties, DirectionProperty {
  ids?: ElementIds | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

export interface CollapseSchema {
  state: 'open' | 'closed'
  props: CollapseProps
  context: Record<string, never>
  event:
    | { type: 'TOGGLE' }
    | { type: 'controlled.open' }
    | { type: 'controlled.close' }
  action: 'invokeOnOpenChange' | 'toggleVisibility'
  guard: 'isOpenControlled'
}

export type CollapseService = Service<CollapseSchema>

export type CollapseMachine = Machine<CollapseSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface CollapseApi<T extends PropTypes = PropTypes> {
  open: boolean
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['element']
  getContentProps: () => T['element']
}
