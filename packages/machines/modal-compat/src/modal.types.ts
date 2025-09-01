import type { Machine, Service } from '@zag-js/core'
import type { DismissableElementHandlers, PersistentElementOptions } from '@zag-js/dismissable'
import type { CommonProperties, DirectionProperty, MaybeElement, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  trigger: string
  positioner: string
  backdrop: string
  content: string
  closeTrigger: string
  title: string
  description: string
}>

export interface ModalProps
  extends DirectionProperty,
  CommonProperties,
  DismissableElementHandlers,
  PersistentElementOptions {
  /**
   * The ids of the elements in the modal. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * Whether to trap focus inside the modal when it's opened
   * @default true
   */
  'trapFocus'?: boolean | undefined
  /**
   * Whether to prevent scrolling behind the modal when it's opened
   * @default true
   */
  'preventScroll'?: boolean | undefined
  /**
   * Whether to prevent pointer interaction outside the element and hide all content below it
   * @default true
   */
  'modal'?: boolean | undefined
  /**
   * Element to receive focus when the modal is closed
   */
  'finalFocusEl'?: (() => MaybeElement) | undefined
  /**
   * Whether to restore focus to the element that had focus before the modal was opened
   */
  'restoreFocus'?: boolean | undefined
  /**
   * Human readable label for the modal, in event the modal title is not rendered
   */
  'aria-label'?: string | undefined
  /**
   * The modal's role
   * @default "dialog"
   */
  'role'?: 'dialog' | 'alertdialog' | undefined
  /**
   * The controlled open state of the modal
   */
  'open'?: boolean | undefined
  /**
   * The initial open state of the modal when rendered.
   * Use when you don't need to control the open state of the modal.
   * @default false
   */
  'defaultOpen'?: boolean | undefined
  /**
   * Function to call when the modal's open state changes
   */
  'onOpenChange'?: ((details: OpenChangeDetails) => void) | undefined
  /**
   * Whether the modal should close when the `Escape` key is pressed or the backdrop is clicked
   * @default false
   */
  'forceAction'?: boolean | undefined
}

type PropsWithDefault
  = | 'role'
  | 'modal'
  | 'trapFocus'
  | 'restoreFocus'
  | 'preventScroll'
  | 'forceAction'

export interface ModalSchema {
  props: RequiredBy<ModalProps, PropsWithDefault>
  context: {
    isOpen: boolean
  }
  effect: 'trackDismissableElement' | 'preventScroll' | 'trapFocus' | 'hideContentBelow'
  state: 'open' | 'closed'
  action: 'focusContent' | 'hideNonModals' | 'restoreNonModals'
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
  /**
   * Function to open or close the modal
   */
  setOpen: (open: boolean) => void

  getTriggerProps: (element: HTMLButtonElement | HTMLAnchorElement) => T['button']
  getBackdropProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
  getCloseTriggerProps: (element: HTMLButtonElement | HTMLAnchorElement) => T['button']
}
