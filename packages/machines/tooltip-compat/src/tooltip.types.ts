import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipPosition {
  x: number
  y: number
}

export interface TooltipProps extends CommonProperties {
  /**
   * The positioning strategy for the tooltip
   * @default "top"
   */
  placement?: TooltipPlacement
  /**
   * The content to display in the tooltip
   */
  content?: string
}

export interface TooltipSchema {
  props: RequiredBy<TooltipProps, 'placement'>
  context: {
    placement: TooltipPlacement
    initialPlacement: TooltipPlacement
    content: string
    position: TooltipPosition
  }
  state: 'closed' | 'open'
  action: 'getPosition' | 'initialize'
  event:
    | { type: 'OPEN' }
    | { type: 'CLOSE' }
    | { type: 'SET_PLACEMENT', placement: TooltipPlacement }
    | EventObject
}

export type TooltipService = Service<TooltipSchema>
export type TooltipMachine = Machine<TooltipSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface TooltipApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the tooltip is currently open
   */
  isOpen: boolean
  /**
   * The current placement of the tooltip
   */
  placement: TooltipPlacement
  /**
   * Show the tooltip
   */
  // show: () => void
  /**
   * Hide the tooltip
   */
  // hide: () => void
  /**
   * Set the tooltip placement
   * @param placement - The new placement for the tooltip
   */
  setPlacement: (placement: TooltipPlacement) => void

  /**
   * Get the content of the tooltip
   */
  getContent: () => string

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
}
