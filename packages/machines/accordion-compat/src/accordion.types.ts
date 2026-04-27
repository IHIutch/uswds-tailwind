import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface ValueChangeDetails {
  value: string[]
}

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  item: (value: string) => string
  itemContent: (value: string) => string
  itemTrigger: (value: string) => string
}>

export interface AccordionProps extends CommonProperties {
  ids?: ElementIds | undefined
  multiple?: boolean | undefined
  value?: string[] | undefined
  defaultValue?: string[] | undefined
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
}

type PropsWithDefault = 'multiple'

export interface AccordionSchema {
  state: 'idle' | 'focused'
  props: RequiredBy<AccordionProps, PropsWithDefault>
  context: {
    value: string[]
  }
  action: string
  guard: string
  effect: string
  event: EventObject
}

export type AccordionService = Service<AccordionSchema>

export type AccordionMachine = Machine<AccordionSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  value: string
}

export interface ItemState {
  expanded: boolean
}

export interface AccordionApi<T extends PropTypes = PropTypes> {
  focused: boolean
  value: string[]
  setValue: (value: string[]) => void
  getItemState: (props: ItemProps) => ItemState
  show: (value: string) => void
  hide: (value: string) => void
  toggle: (value: string) => void

  getRootProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getItemTriggerProps: (props: ItemProps) => T['button']
  getItemContentProps: (props: ItemProps) => T['element']
}
