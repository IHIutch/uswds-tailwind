import type { VariantProps } from '../tv.config'
import * as modal from '@uswds-tailwind/modal-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { Button } from '../button'
import { tv } from '../tv.config'

const modalVariants = tv({
  slots: {
    backdrop: 'fixed z-40 inset-0 bg-black/70 animate-in ease-in-out duration-150 fade-in',
    positioner: 'fixed inset-0 overflow-y-auto flex items-center justify-center p-4 z-50 animate-in ease-in-out duration-150 fade-in pointer-events-none',
    content: 'relative w-full rounded-lg bg-white shadow-lg pointer-events-auto',
    body: '',
    title: 'font-bold font-merriweather',
    description: '',
    footer: 'mt-6',
    closeTrigger: 'cursor-pointer absolute top-0 right-0 p-1 text-gray-50 bg-transparent rounded-sm hover:text-gray-90 active:text-gray-90 focus:outline-4 focus:outline-offset-4 focus:outline-blue-40v',
    closeIcon: 'icon-[material-symbols--close] size-8 mt-0.5 mr-0.5 align-middle',
  },
  variants: {
    size: {
      default: {
        content: 'max-w-lg',
        body: 'p-8 pt-10',
        title: 'text-xl',
        description: 'mt-2',
      },
      lg: {
        content: 'max-w-4xl',
        body: 'px-8 pb-16 pt-14 w-full max-w-2xl mx-auto',
        title: 'text-3xl',
        description: 'mt-4',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export type ModalContextProps = {
  api: modal.Api
} & VariantProps<typeof modalVariants>

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
} & VariantProps<typeof modalVariants>

function ModalRoot({ children, size, ...props }: ModalRootProps) {
  const service = useMachine(modal.machine, {
    id: React.useId(),
    ...props,
  })
  const api = modal.connect(service, normalizeProps)

  return (
    <ModalContext.Provider value={{ api, size }}>
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
  const { backdrop } = modalVariants()
  const mergedProps = mergeProps(api.getBackdropProps(), props)

  return (
    <div
      {...mergedProps}
      className={backdrop({ className })}
    />
  )
}

export type ModalPositionerProps = React.ComponentPropsWithoutRef<'div'>

const ModalPositioner = React.forwardRef<HTMLDivElement, ModalPositionerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    const { positioner } = modalVariants()
    return (
      <div
        hidden={!api.open}
        data-state={api.open ? 'open' : 'closed'}
        {...props}
        className={positioner({ className })}
        ref={forwardedRef}
      />
    )
  },
)

export type ModalContentProps = React.ComponentPropsWithoutRef<'div'>

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api, size } = useModalContext()
    const { content } = modalVariants({ size })
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <div
        {...mergedProps}
        className={content({ className })}
        ref={forwardedRef}
      />
    )
  },
)

export type ModalTitleProps = React.ComponentPropsWithoutRef<'div'>

function ModalTitle({ className, ...props }: ModalTitleProps) {
  const { api, size } = useModalContext()
  const { title } = modalVariants({ size })
  const mergedProps = mergeProps(api.getTitleProps(), props)

  return (
    <div
      {...mergedProps}
      className={title({ className })}
    />
  )
}

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<'div'>

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  const { api, size } = useModalContext()
  const { description } = modalVariants({ size })
  const mergedProps = mergeProps(api.getDescriptionProps(), props)

  return (
    <div
      {...mergedProps}
      className={description({ className })}
    />
  )
}

export type ModalBodyProps = React.ComponentPropsWithoutRef<'div'>

function ModalBody({ className, ...props }: ModalBodyProps) {
  const { size } = useModalContext()
  const { body } = modalVariants({ size })
  return (
    <div
      {...props}
      className={body({ className })}
    />
  )
}

export type ModalFooterProps = React.ComponentPropsWithoutRef<'div'>

function ModalFooter({ className, ...props }: ModalFooterProps) {
  const { footer } = modalVariants()
  return (
    <div
      {...props}
      className={footer({ className })}
    />
  )
}

export type ModalCloseTriggerProps = React.ComponentPropsWithoutRef<'button'>

const ModalCloseTrigger = React.forwardRef<HTMLButtonElement, ModalCloseTriggerProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useModalContext()
    const { closeTrigger, closeIcon } = modalVariants()
    const mergedProps = mergeProps(api.getCloseTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        className={closeTrigger({ className })}
        ref={forwardedRef}
      >
        {children ?? <div className={closeIcon()} />}
      </button>
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
ModalBody.displayName = 'Modal.Body'
ModalFooter.displayName = 'Modal.Footer'
ModalCloseTrigger.displayName = 'Modal.CloseTrigger'

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Backdrop: ModalBackdrop,
  Positioner: ModalPositioner,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseTrigger: ModalCloseTrigger,
}
