import * as modal from '@uswds-tailwind/modal-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { Button } from '../button'
import { cx } from '../cva.config'

export interface ModalContextProps {
  api: modal.Api
}

const ModalContext = React.createContext<ModalContextProps | null>(null)

function useModalContext() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('Modal components must be used within a Modal.Root')
  }
  return context
}

export type ModalRootProps = Omit<modal.Props, 'id'> & {
  children: React.ReactNode
}

function ModalRoot({ children, ...props }: ModalRootProps) {
  const service = useMachine(modal.machine, {
    id: React.useId(),
    ...props,
  })
  const api = modal.connect(service, normalizeProps)

  return (
    <ModalContext.Provider value={{ api }}>
      {children}
    </ModalContext.Provider>
  )
}

export type ModalTriggerProps = React.ComponentPropsWithoutRef<'button'>

const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <Button
        {...mergedProps}
        className={className}
        ref={forwardedRef}
      />
    )
  },
)

export type ModalBackdropProps = React.ComponentPropsWithoutRef<'div'>

function ModalBackdrop({ className, ...props }: ModalBackdropProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getBackdropProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('fixed z-40 inset-0 bg-black/70 animate-in ease-in-out duration-150 fade-in', className)}
    />
  )
}

export type ModalPositionerProps = React.ComponentPropsWithoutRef<'div'>

const ModalPositioner = React.forwardRef<HTMLDivElement, ModalPositionerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    return (
      <div
        hidden={!api.open}
        data-state={api.open ? 'open' : 'closed'}
        {...props}
        className={cx('fixed inset-0 overflow-y-auto flex items-center justify-center p-4 z-50 animate-in ease-in-out duration-150 fade-in pointer-events-none', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type ModalContentProps = React.ComponentPropsWithoutRef<'div'>

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx('relative w-full max-w-lg rounded-lg bg-white shadow-lg pointer-events-auto', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type ModalTitleProps = React.ComponentPropsWithoutRef<'h2'>

function ModalTitle({ className, ...props }: ModalTitleProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getTitleProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('text-xl font-bold font-merriweather', className)}
    />
  )
}

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<'p'>

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getDescriptionProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('mt-2', className)}
    />
  )
}

export type ModalCloseTriggerProps = React.ComponentPropsWithoutRef<'button'>

const ModalCloseTrigger = React.forwardRef<HTMLButtonElement, ModalCloseTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    const mergedProps = mergeProps(api.getCloseTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        className={className}
        ref={forwardedRef}
      />
    )
  },
)

ModalRoot.displayName = 'Modal.Root'
ModalTrigger.displayName = 'Modal.Trigger'
ModalBackdrop.displayName = 'Modal.Backdrop'
ModalPositioner.displayName = 'Modal.Positioner'
ModalContent.displayName = 'Modal.Content'
ModalTitle.displayName = 'Modal.Title'
ModalDescription.displayName = 'Modal.Description'
ModalCloseTrigger.displayName = 'Modal.CloseTrigger'

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Backdrop: ModalBackdrop,
  Positioner: ModalPositioner,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseTrigger: ModalCloseTrigger,
}
