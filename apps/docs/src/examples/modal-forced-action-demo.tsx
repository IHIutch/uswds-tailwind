import { ButtonGroup, Modal } from '@uswds-tailwind/react'
import { useState } from 'react'

export default function ModalForcedActionDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Modal.Root forceAction open={open} onOpenChange={event => setOpen(event.open)}>
      <Modal.Trigger>Open modal with forced action</Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Body>
            <Modal.Title>
              <h2>Your session will end soon.</h2>
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
                <ButtonGroup.Button unstyled className="p-3" onClick={() => setOpen(false)}>Sign out</ButtonGroup.Button>
              </ButtonGroup.Root>
            </Modal.Footer>
          </Modal.Body>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>
  )
}
