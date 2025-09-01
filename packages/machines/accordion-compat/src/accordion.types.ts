import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * -----------------------------------------------------------------------------
 */

export type ElementIds = Partial<{
  root: string
}>

export interface AccordionProps extends CommonProperties {
  /**
   * Allow multiple accordion items to stay open at the same time.
   * @default false
   */
  multiple?: boolean
}

export interface AccordionSchema {
  props: RequiredBy<AccordionProps, 'multiple'>
  context: {
    value: string[]
  }
  state: 'idle'
  action: 'openItem' | 'closeItem' | 'toggleItem'
  event:
  | { type: 'OPEN', id: string }
  | { type: 'CLOSE', id: string }
  | { type: 'TOGGLE', id: string }
}

export type AccordionService = Service<AccordionSchema>
export type AccordionMachine = Machine<AccordionSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * -----------------------------------------------------------------------------
 */

export interface AccordionApi<T extends PropTypes = PropTypes> {
  /**
   * Currently opened item ids.
   */
  value: string[]
  /** Open an item by id */
  open: (id: string) => void
  /** Close an item by id */
  close: (id: string) => void
  /** Toggle an item by id */
  toggle: (id: string) => void
  /** Check if an item is open */
  isItemOpen: (id: string) => boolean

  getRootProps: () => T['element']
  getItemProps: (args: { value: string }) => T['element']
  getTriggerProps: (args: { value: string }) => T['button']
  getContentProps: (args: { value: string }) => T['element']
}
