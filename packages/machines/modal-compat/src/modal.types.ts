import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  trigger: string
  positioner: string
  backdrop: string
  content: string
  closeTrigger: string
}>

export interface ModalProps extends CommonProperties {
  /**
   * The ids of the elements in the modal. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * The controlled open state of the modal
   */
  open?: boolean | undefined
  /**
   * Whether the modal should close when the `Escape` key is pressed or the backdrop is clicked
   * @default false
   */
  forceAction?: boolean | undefined
}

type PropsWithDefault = 'forceAction'

export interface ModalSchema {
  props: RequiredBy<ModalProps, PropsWithDefault>
  context: {
    isOpen: boolean
  }
  effect: 'trackDismissableElement' | 'preventScroll' | 'trapFocus' | 'hideContentBelow'
  state: 'open' | 'closed'
  action: 'focusContent'
  event: { type: 'OPEN' | 'CLOSE' | 'TOGGLE' }
}

export type ModalService = Service<ModalSchema>

export type ModalMachine = Machine<ModalSchema>

/* -----------------------------------------------------------------------------
 * Component props
 * ----------------------------------------------------------------------------- */

export interface ModalApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the modal is open
   */
  open: boolean

  getTriggerProps: (element: HTMLButtonElement | HTMLAnchorElement) => T['button']
  getBackdropProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
  getCloseTriggerProps: (element: HTMLButtonElement | HTMLAnchorElement) => T['button']
}
