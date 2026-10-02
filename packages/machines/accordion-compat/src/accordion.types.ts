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
  itemContent: (value: string) => string
  itemTrigger: (value: string) => string
}>

export interface AccordionProps extends CommonProperties {
  /**
   * The ids of the elements in the accordion. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * Whether multiple accordion items can be expanded at the same time.
   * @default false
   */
  multiple?: boolean | undefined
  /**
   * The controlled value: the set of expanded item values.
   */
  value?: string[] | undefined
  /**
   * The initial set of expanded item values when uncontrolled.
   * @default []
   */
  defaultValue?: string[] | undefined
  /**
   * Called when the set of expanded items changes.
   */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
}

type PropsWithDefault = 'multiple' | 'defaultValue'

export interface AccordionSchema {
  props: RequiredBy<AccordionProps, PropsWithDefault>
  state: 'idle'
  context: {
    value: string[]
  }
  refs: {
    scrollCleanup: VoidFunction | null
  }
  action: 'expand' | 'collapse' | 'setValue' | 'scrollIntoView' | 'cancelScrollIntoView'
  guard: 'isExpanded'
  event: EventObject & {
    type:
      | 'TRIGGER.CLICK'
      | 'TRIGGER.EXPAND'
      | 'TRIGGER.COLLAPSE'
      | 'VALUE.SET'
  }
}

export type AccordionService = Service<AccordionSchema>
export type AccordionMachine = Machine<AccordionSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ItemProps {
  /**
   * The value of the accordion item.
   */
  value: string
}

export interface ItemState {
  /**
   * Whether the accordion item is expanded.
   */
  expanded: boolean
}

export interface AccordionApi<T extends PropTypes = PropTypes> {
  /**
   * The values of the expanded accordion items.
   */
  value: string[]
  /**
   * Sets the expanded accordion items.
   */
  setValue: (value: string[]) => void
  /**
   * Returns the state of an accordion item.
   */
  getItemState: (props: ItemProps) => ItemState
  /**
   * Expands the accordion item with the given value.
   */
  show: (value: string) => void
  /**
   * Collapses the accordion item with the given value.
   */
  hide: (value: string) => void
  /**
   * Toggles the expanded state of the accordion item with the given value.
   */
  toggle: (value: string) => void

  getRootProps: () => T['element']
  getItemProps: (props: ItemProps) => T['element']
  getItemTriggerProps: (props: ItemProps) => T['button']
  getItemContentProps: (props: ItemProps) => T['element']
}
