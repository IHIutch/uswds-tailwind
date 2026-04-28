import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

export interface SelectionDetails {
  value: string
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

/* -----------------------------------------------------------------------------
 * Item props for connect
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  value: string
}

/* -----------------------------------------------------------------------------
 * Machine props
 * ----------------------------------------------------------------------------- */

export interface DropdownProps extends CommonProperties {
  ids?: ElementIds | undefined
  closeOnSelect?: boolean | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  onSelect?: ((details: SelectionDetails) => void) | undefined
}

type PropsWithDefault = 'closeOnSelect'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface DropdownSchema {
  props: RequiredBy<DropdownProps, PropsWithDefault>
  state: 'closed' | 'open'
  context: Record<string, never>
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type DropdownService = Service<DropdownSchema>
export type DropdownMachine = Machine<DropdownSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface DropdownApi<T extends PropTypes = PropTypes> {
  open: boolean

  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
}
