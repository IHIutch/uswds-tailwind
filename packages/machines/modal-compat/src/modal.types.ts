import type { EventObject, Machine, Service } from '@zag-js/core'
import type {
  CommonProperties,
  PropTypes,
  RequiredBy,
} from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  root: string
  trigger: string
  backdrop: string
  positioner: string
  content: string
  closeTrigger: string
  title: string
  description: string
}>

export interface ModalProps extends CommonProperties {
  /**
   * The ids of the elements in the modal. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * Names the dialog when it has no title part. Takes precedence over the title.
   */
  'aria-label'?: string | undefined
  /**
   * The controlled open state of the modal.
   */
  'open'?: boolean | undefined
  /**
   * The initial open state of the modal when rendered.
   * Use when you don't need to control the open state.
   * @default false
   */
  'defaultOpen'?: boolean | undefined
  /**
   * Function called when the modal's open state changes.
   */
  'onOpenChange'?: ((details: OpenChangeDetails) => void) | undefined
  /**
   * Whether the user is forced to take an action. Disables
   * Escape and overlay dismissal and prevents pointer
   * interaction beneath the overlay
   * @default false
   */
  'forceAction'?: boolean | undefined
}

type PropsWithDefault = 'forceAction'

export interface ModalSchema {
  props: RequiredBy<ModalProps, PropsWithDefault>
  state: 'open' | 'closed'
  context: {
    rendered: {
      title: boolean
      description: boolean
    }
    // The index of the trigger that opened the modal, so focus can return to it on close.
    triggerIndex: number | null
  }
  guard: 'isOpenControlled'
  effect: 'trackDismissableElement' | 'preventScroll' | 'hideContentBelow' | 'trapFocus'
  action: 'toggleVisibility' | 'invokeOnOpen' | 'invokeOnClose' | 'checkRenderedElements' | 'setTriggerIndex'
  event: EventObject & (
    | { type: 'OPEN' }
    | { type: 'CLOSE' }
    | { type: 'TOGGLE', index?: number }
    | { type: 'CONTROLLED.OPEN' }
    | { type: 'CONTROLLED.CLOSE' }
  )
}

export type ModalService = Service<ModalSchema>
export type ModalMachine = Machine<ModalSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ModalApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the modal is open.
   */
  open: boolean
  /**
   * Function to open or close the modal.
   */
  setOpen: (open: boolean) => void

  getRootProps: () => T['element']
  getTriggerProps: (props?: { index?: number }) => T['button']
  getBackdropProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
  getCloseTriggerProps: (props?: { index?: number }) => T['button']
  getTitleProps: () => T['element']
  getDescriptionProps: () => T['element']
}
