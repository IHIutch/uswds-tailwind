import React from 'react'
import preview from '../../.storybook/preview'
import { ButtonGroup } from '../button-group'
import { Modal } from './modal'

const meta = preview.meta({
  title: 'Components/Modal',
  component: Modal.Root,
})

export const Default = meta.story({
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Modal.Root open={open} onOpenChange={e => setOpen(e.open)}>
        <Modal.Trigger>
          Open default modal
        </Modal.Trigger>
        <Modal.Backdrop />
        <Modal.Positioner>
          <Modal.Content>
            <div className="p-8 pt-10">
              <Modal.Title>
                <h4>Are you sure you want to continue?</h4>
              </Modal.Title>
              <Modal.Description>
                <p>You have unsaved changes that will be lost.</p>
              </Modal.Description>
              <div className="mt-6">
                <ButtonGroup.Root>
                  <ButtonGroup.Button
                    onClick={() => setOpen(false)}
                  >
                    Continue without saving
                  </ButtonGroup.Button>
                  <ButtonGroup.Button
                    unstyled
                    className="p-3"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </ButtonGroup.Button>
                </ButtonGroup.Root>
              </div>
              <Modal.CloseTrigger
                className="absolute top-0 right-0 p-1 text-gray-50 bg-transparent rounded-sm hover:text-gray-90 active:text-gray-90 focus:outline-4 focus:outline-offset-4 focus:outline-blue-40v"
                aria-label="Close this window"
              >
                <div className="icon-[material-symbols--close] size-8 mt-0.5 mr-0.5 align-middle" />
              </Modal.CloseTrigger>
            </div>
          </Modal.Content>
        </Modal.Positioner>
      </Modal.Root>
    )
  },
})

export const Large = meta.story({
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Modal.Root open={open} onOpenChange={e => setOpen(e.open)}>
        <Modal.Trigger>
          Open large modal
        </Modal.Trigger>
        <Modal.Backdrop />
        <Modal.Positioner>
          <Modal.Content className="max-w-4xl">
            <div className="px-8 pb-16 pt-14 w-full max-w-2xl mx-auto">
              <Modal.Title>
                <h4 className="text-3xl">Are you sure you want to continue?</h4>
              </Modal.Title>
              <Modal.Description className="mt-4">
                <p>You have unsaved changes that will be lost.</p>
              </Modal.Description>
              <div className="mt-6">
                <ButtonGroup.Root>
                  <ButtonGroup.Button onClick={() => setOpen(false)}>Continue without saving</ButtonGroup.Button>
                  <ButtonGroup.Button
                    unstyled
                    className="p-3"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </ButtonGroup.Button>
                </ButtonGroup.Root>
              </div>
              <Modal.CloseTrigger
                className="absolute top-0 right-0 p-1 text-gray-50 bg-transparent rounded-sm hover:text-gray-90 active:text-gray-90 focus:outline-4 focus:outline-offset-4 focus:outline-blue-40v"
                aria-label="Close this window"
              >
                <div className="icon-[material-symbols--close] size-8 mt-0.5 mr-0.5 align-middle" />
              </Modal.CloseTrigger>
            </div>
          </Modal.Content>
        </Modal.Positioner>
      </Modal.Root>
    )
  },
})

export const ForcedAction = meta.story({
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Modal.Root forceAction open={open} onOpenChange={e => setOpen(e.open)}>
        <Modal.Trigger>
          Open modal with forced action
        </Modal.Trigger>
        <Modal.Backdrop />
        <Modal.Positioner>
          <Modal.Content>
            <div className="p-8 pt-10">
              <Modal.Title>
                <h4>Your session will end soon.</h4>
              </Modal.Title>
              <Modal.Description>
                <p>
                  You've been inactive for too long. Please choose to stay signed in or sign out.
                  Otherwise, you'll be signed out automatically in 5 minutes.
                </p>
              </Modal.Description>
              <div className="mt-6">
                <ButtonGroup.Root>
                  <ButtonGroup.Button onClick={() => setOpen(false)}>Yes, stay signed in</ButtonGroup.Button>
                  <ButtonGroup.Button
                    unstyled
                    className="p-3"
                    onClick={() => setOpen(false)}
                  >
                    Sign out
                  </ButtonGroup.Button>
                </ButtonGroup.Root>
              </div>
            </div>
          </Modal.Content>
        </Modal.Positioner>
      </Modal.Root>
    )
  },
})
