import * as modal from '@uswds-tailwind/modal-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
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

type ModalRootProps = Omit<modal.Props, 'id'> & {
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

type ModalTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function ModalTrigger({ className, ...props }: ModalTriggerProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getTriggerProps(), props)

  return (
    <button
      {...mergedProps}
      className={className}
    />
  )
}

type ModalBackdropProps = React.HTMLAttributes<HTMLDivElement>

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

type ModalPositionerProps = React.HTMLAttributes<HTMLDivElement>

function ModalPositioner({ className, ...props }: ModalPositionerProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getPositionerProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('fixed inset-0 overflow-y-auto flex items-center justify-center p-4 z-50 animate-in ease-in-out duration-150 fade-in', className)}
    />
  )
}

type ModalContentProps = React.HTMLAttributes<HTMLDivElement>

function ModalContent({ className, ...props }: ModalContentProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getContentProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx('@container relative w-full max-w-lg rounded-lg bg-white shadow-lg', className)}
    />
  )
}

type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>

function ModalTitle({ className, ...props }: ModalTitleProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getTitleProps(), props)

  return (
    <h2
      {...mergedProps}
      className={cx('text-xl font-bold font-merriweather', className)}
    />
  )
}

type ModalDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getDescriptionProps(), props)

  return (
    <p
      {...mergedProps}
      className={cx('mt-2', className)}
    />
  )
}

type ModalCloseTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function ModalCloseTrigger({ className, ...props }: ModalCloseTriggerProps) {
  const { api } = useModalContext()
  const mergedProps = mergeProps(api.getCloseTriggerProps(), props)

  return (
    <button
      {...mergedProps}
      className={className}
    />
  )
}

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
