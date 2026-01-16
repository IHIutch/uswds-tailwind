import type { EventObject, Machine, Service } from '@zag-js/core'
import type { PropTypes } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface DropdownProps {
  ids?: ElementIds
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (details: { open: boolean }) => void
}

export interface DropdownSchema {
  props: DropdownProps
  state: 'open' | 'closed'
  action: 'invokeOnOpen' | 'invokeOnClose'
  event: EventObject & (
    | { type: 'OPEN' | 'CLOSE' | 'TOGGLE' }
    | { type: 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE' }
  )
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
