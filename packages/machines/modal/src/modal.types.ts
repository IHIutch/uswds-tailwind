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
   * Element to receive focus when the modal is opened
   */
  'initialFocusEl'?: (() => MaybeElement) | undefined
  /**
   * Element to receive focus when the modal is closed
   */
  'finalFocusEl'?: (() => MaybeElement) | undefined
  /**
   * Whether to restore focus to the element that had focus before the modal was opened
   */
  'restoreFocus'?: boolean | undefined
  /**
   * Whether to close the modal when the outside is clicked
   * @default true
   */
  'closeOnInteractOutside'?: boolean | undefined
  /**
   * Whether to close the modal when the escape key is pressed
   * @default true
   */
  'closeOnEscape'?: boolean | undefined
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
}

type PropsWithDefault =
  | 'closeOnInteractOutside'
  | 'closeOnEscape'
  | 'role'
  | 'modal'
  | 'trapFocus'
  | 'restoreFocus'
  | 'preventScroll'
  | 'initialFocusEl'

export interface ModalSchema {
  props: RequiredBy<ModalProps, PropsWithDefault>
  state: 'open' | 'closed'
  context: {
    rendered: { title: boolean, description: boolean }
  }
  guard: 'isOpenControlled'
  effect: 'trackDismissableElement' | 'preventScroll' | 'trapFocus' | 'hideContentBelow'
  action: 'checkRenderedElements' | 'syncZIndex' | 'invokeOnClose' | 'invokeOnOpen' | 'toggleVisibility'
  event: {
    type: 'CONTROLLED.OPEN' | 'CONTROLLED.CLOSE' | 'OPEN' | 'CLOSE' | 'TOGGLE'
  }
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

  getTriggerProps: () => T['button']
  getBackdropProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
  getTitleProps: () => T['element']
  getDescriptionProps: () => T['element']
  getCloseTriggerProps: () => T['button']
}
