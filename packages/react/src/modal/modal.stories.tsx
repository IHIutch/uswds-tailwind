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
            <Modal.Body>
              <Modal.Title>
                <h4>Are you sure you want to continue?</h4>
              </Modal.Title>
              <Modal.Description>
                <p>You have unsaved changes that will be lost.</p>
              </Modal.Description>
              <Modal.Footer>
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
              </Modal.Footer>
            </Modal.Body>
            <Modal.CloseTrigger />
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
      <Modal.Root size="lg" open={open} onOpenChange={e => setOpen(e.open)}>
        <Modal.Trigger>
          Open large modal
        </Modal.Trigger>
        <Modal.Backdrop />
        <Modal.Positioner>
          <Modal.Content>
            <Modal.Body>
              <Modal.Title>
                <h4>Are you sure you want to continue?</h4>
              </Modal.Title>
              <Modal.Description>
                <p>You have unsaved changes that will be lost.</p>
              </Modal.Description>
              <Modal.Footer>
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
              </Modal.Footer>
            </Modal.Body>
            <Modal.CloseTrigger />
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
            <Modal.Body>
              <Modal.Title>
                <h4>Your session will end soon.</h4>
              </Modal.Title>
              <Modal.Description>
                <p>
                  You've been inactive for too long. Please choose to stay signed in or sign out.
                  Otherwise, you'll be signed out automatically in 5 minutes.
                </p>
              </Modal.Description>
              <Modal.Footer>
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
              </Modal.Footer>
            </Modal.Body>
          </Modal.Content>
        </Modal.Positioner>
      </Modal.Root>
    )
  },
})
