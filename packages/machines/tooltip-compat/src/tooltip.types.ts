import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'
import type { PositionStyles } from './tooltip.utils'

export type Placement = 'top' | 'bottom' | 'right' | 'left'

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface TooltipProps extends CommonProperties {
  /** Element ids for composition. */
  ids?: ElementIds | undefined
  /**
   * Preferred placement.
   * @default "top"
   */
  placement?: Placement | undefined
  /** Controlled open state. Takes precedence over `defaultOpen`. */
  open?: boolean | undefined
  /** The initial open value for an uncontrolled tooltip. Ignored when `open` is defined. */
  defaultOpen?: boolean | undefined
  /** Called when the open state is intended to change. */
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

export interface OpenChangeDetails {
  open: boolean
}

type PropsWithDefault = 'placement'

interface TooltipEvent { type: 'SHOW' | 'HIDE' | 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE' }

export interface TooltipSchema {
  props: RequiredBy<TooltipProps, PropsWithDefault>
  state: 'closed' | 'open'
  context: {
    resolvedPlacement: Placement | null
    revealed: boolean
    wrap: boolean
    styles: PositionStyles | null
  }
  event: TooltipEvent
  action:
    | 'invokeOnOpen'
    | 'invokeOnClose'
    | 'syncControlledOpen'
    | 'clearVisibility'
  effect: 'reposition' | 'trackEscape' | 'waitForReveal'
  guard: 'isOpenControlled'
}

export type TooltipService = Service<TooltipSchema>

export type TooltipMachine = Machine<TooltipSchema>

export interface TooltipApi<T extends PropTypes = PropTypes> {
  /** Whether the tooltip is open. */
  open: boolean
  /** Whether the reveal delay has elapsed. */
  visible: boolean
  /** The resolved placement. Null until positioning has run once. */
  placement: Placement | null
  /** Request the next open state. A controlled parent must update `open` to accept the request. */
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['element']
  getContentProps: () => T['element']
}
