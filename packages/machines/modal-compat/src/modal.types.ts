import type { EventObject, Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

export interface OpenChangeDetails {
  open: boolean
}

/* -----------------------------------------------------------------------------
 * Element IDs
 * ----------------------------------------------------------------------------- */

export type ElementIds = Partial<{
  trigger: string
  backdrop: string
  content: string
  title: string
  description: string
  closeTrigger: string
}>

/* -----------------------------------------------------------------------------
 * Machine props
 * ----------------------------------------------------------------------------- */

export interface ModalProps extends CommonProperties {
  ids?: ElementIds | undefined
  forceAction?: boolean | undefined
  preventScroll?: boolean | undefined
  trapFocus?: boolean | undefined
  modal?: boolean | undefined
  role?: 'dialog' | 'alertdialog' | undefined
  initialFocusEl?: (() => HTMLElement | null) | undefined
  restoreFocus?: boolean | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined
}

type PropsWithDefault
  = | 'forceAction'
    | 'preventScroll'
    | 'trapFocus'
    | 'modal'
    | 'role'
    | 'restoreFocus'
    | 'defaultOpen'

/* -----------------------------------------------------------------------------
 * Machine schema
 * ----------------------------------------------------------------------------- */

export interface ModalSchema {
  props: RequiredBy<ModalProps, PropsWithDefault>
  state: 'open' | 'closed'
  context: Record<string, never>
  event: EventObject
  action: string
  effect: string
  guard: string
}

export type ModalService = Service<ModalSchema>
export type ModalMachine = Machine<ModalSchema>

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ModalApi<T extends PropTypes = PropTypes> {
  open: boolean
  setOpen: (open: boolean) => void

  getTriggerProps: () => T['button']
  getBackdropProps: () => T['element']
  getContentProps: () => T['element']
  getTitleProps: () => T['element']
  getDescriptionProps: () => T['element']
  getCloseTriggerProps: () => T['button']
}
