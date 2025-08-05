import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface DropdownProps extends DirectionProperty, CommonProperties {
  ids?: ElementIds
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (details: { open: boolean }) => void
}

export interface DropdownSchema {
  props: RequiredBy<DropdownProps, 'dir'>
  state: 'open' | 'closed'
  context: {}
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
