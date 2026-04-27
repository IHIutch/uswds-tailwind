import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Position type
 * ----------------------------------------------------------------------------- */

export type Position = 'top' | 'bottom' | 'right' | 'left'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface TooltipProps extends CommonProperties {
  ids?: ElementIds | undefined
  position?: Position | undefined
  closeOnEscape?: boolean | undefined
  disabled?: boolean | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

type PropsWithDefault
  = | 'id'
    | 'position'
    | 'closeOnEscape'

export interface TooltipSchema {
  state: 'closed' | 'open'
  props: RequiredBy<TooltipProps, PropsWithDefault>
  context: {
    currentPosition: Position
    isVisible: boolean
    isWrapped: boolean
    contentStyle: Record<string, string>
  }
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type TooltipService = Service<TooltipSchema>

export type TooltipMachine = Machine<TooltipSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface TooltipApi<T extends PropTypes = PropTypes> {
  open: boolean
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['element']
  getContentProps: () => T['element']
}
