import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface CollapseProps extends CommonProperties {
  /**
   * The controlled open state of the collapse
   */
  open?: boolean
  /**
   * The initial open state when uncontrolled
   */
  defaultOpen?: boolean
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (details: { open: boolean }) => void
}

export interface CollapseSchema {
  props: Partial<CollapseProps>
  state: 'open' | 'closed'
  action: 'invokeOnOpen' | 'invokeOnClose' | 'toggleVisibility'
  event: { type: 'OPEN' | 'CLOSE' | 'TOGGLE' }
}

export type CollapseService = Service<CollapseSchema>
export type CollapseMachine = Machine<CollapseSchema>

export interface CollapseApi<T extends PropTypes = PropTypes> {
  /** Whether the content is open */
  isOpen: boolean
  /** Set the open state */
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
}
