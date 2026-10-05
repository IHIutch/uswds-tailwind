import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}
export type ElementIds = Partial<{
  root: string
  content: string
  trigger: string
}>

export interface CollapseProps extends CommonProperties {
  /** The ids of the elements in the collapse. Useful for composition. */
  ids?: ElementIds | undefined
  /**
   * The controlled open state. Internal requests call `onOpenChange`, but do not change the rendered state until
   * the consumer updates this prop. Leave `undefined` for uncontrolled behavior.
   */
  open?: boolean | undefined
  /**
   * Initial open state when uncontrolled. The compat wrapper seeds this from `data-state="open"` on the root.
   * @default false
   */
  defaultOpen?: boolean | undefined
  /**
   * The callback invoked when the open state changes. NET-NEW Zag-idiom escape hatch (kept — no observable DOM
   * effect; USWDS has no analog). Fired on every committed toggle path with the INTENDED next value, and NOT on
   * a bare controlled-prop sync (no echo).
   */
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

export interface CollapseSchema {
  state: 'open' | 'closed'
  props: CollapseProps
  context: Record<string, never>
  action: 'invokeOnOpen' | 'invokeOnClose' | 'syncControlledOpen'
  guard: 'isOpenControlled'
  event: EventObject & {
    type: 'OPEN' | 'CLOSE' | 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE'
  }
}

export type CollapseService = Service<CollapseSchema>
export type CollapseMachine = Machine<CollapseSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface CollapseApi<T extends PropTypes = PropTypes> {
  /** Whether the collapse is open. */
  open: boolean
  /**
   * Request an open state even before content mounts. Repeated effective values do not notify.
   * Controlled requests notify the parent and preserve its effective value until accepted.
   */
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
  getIndicatorProps: () => T['element']
}
