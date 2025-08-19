import type { Machine, Service } from '@zag-js/core'
import type { DismissableElementHandlers } from '@zag-js/dismissable'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface DropdownProps extends DirectionProperty,
  CommonProperties,
  DismissableElementHandlers {
  ids?: ElementIds
  open?: boolean
  defaultOpen?: boolean
  positioning?: PositioningOptions | undefined
  onOpenChange?: (details: { open: boolean }) => void
}

export interface DropdownSchema {
  props: RequiredBy<DropdownProps, 'dir'>
  state: 'open' | 'closed'
  context: {
    currentPlacement: Placement | undefined
  }
  effect: 'trackInteractOutside' | 'trackPositioning'
  action: 'invokeOnOpen' | 'invokeOnClose'
  event:
  | { type: 'OPEN' | 'CLOSE' | 'TOGGLE' }
  | { type: 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE' }
}

export type DropdownService = Service<DropdownSchema>
export type DropdownMachine = Machine<DropdownSchema>

export interface DropdownApi<T extends PropTypes = PropTypes> {
  open: boolean
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['element']
  getContentProps: () => T['element']
  getItemProps: () => T['element']
}
