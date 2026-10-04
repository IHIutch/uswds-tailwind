import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

export interface ItemSelectDetails {
  value: string
}

export type ElementIds = Partial<{
  root: string
  trigger: string
  content: string
}>

export interface DropdownProps extends CommonProperties {
  /** The ids of the elements in the dropdown. Useful for composition. */
  ids?: ElementIds | undefined
  /** The controlled open state. */
  open?: boolean | undefined
  /** The initial open state when uncontrolled. */
  defaultOpen?: boolean | undefined
  /** Called when the open state changes. */
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
  /** Called when a dropdown item is activated. */
  onItemSelect?: ((details: ItemSelectDetails) => void) | undefined
}

export interface DropdownSchema {
  props: DropdownProps
  state: 'closed' | 'open'
  context: Record<string, never>
  action: 'focusTrigger' | 'invokeOnOpen' | 'invokeOnClose' | 'invokeOnSelect' | 'syncControlledOpen'
  guard: 'isOpenControlled'
  effect: 'trackDismissableElement'
  event: EventObject & (
    | { type: 'TRIGGER.CLICK' }
    | { type: 'ESCAPE' }
    | { type: 'ITEM.CLICK', value?: string | undefined }
    | { type: 'OPEN' }
    | { type: 'CLOSE' }
    | { type: 'CONTROLLED.OPEN' }
    | { type: 'CONTROLLED.CLOSE' }
  )
}

export type DropdownService = Service<DropdownSchema>
export type DropdownMachine = Machine<DropdownSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  value?: string | undefined
}

export interface ItemLinkProps {
  value?: string | undefined
}

export interface DropdownApi<T extends PropTypes = PropTypes> {
  /** Whether the dropdown is open. */
  open: boolean
  /** Sets the open state of the dropdown. */
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getItemLinkProps: (props: ItemLinkProps) => T['element']
}
