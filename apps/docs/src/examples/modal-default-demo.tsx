import { ButtonGroup, Modal } from '@uswds-tailwind/react'
import { useState } from 'react'

export default function ModalDefaultDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Modal.Root open={open} onOpenChange={event => setOpen(event.open)}>
      <Modal.Trigger>Open default modal</Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <Modal.Body>
            <Modal.Title>
              <h2>Are you sure you want to continue?</h2>
            </Modal.Title>
            <Modal.Description>
              <p>You have unsaved changes that will be lost.</p>
            </Modal.Description>
            <Modal.Footer>
              <ButtonGroup.Root>
                <ButtonGroup.Button onClick={() => setOpen(false)}>Continue without saving</ButtonGroup.Button>
                <ButtonGroup.Button unstyled className="p-3" onClick={() => setOpen(false)}>Go back</ButtonGroup.Button>
              </ButtonGroup.Root>
            </Modal.Footer>
          </Modal.Body>
          <Modal.CloseTrigger aria-label="Close this window" />
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>
  )
}
