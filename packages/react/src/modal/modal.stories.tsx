import preview from '../../.storybook/preview'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { Modal } from './modal'

const meta = preview.meta({
  title: 'Components/Modal',
  component: Modal.Root,
})

export const Default = meta.story({
  render: () => (
    <Modal.Root>
      <Modal.Trigger>
        <Button>Open default modal</Button>
      </Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <div className="p-8 pt-10">
            <Modal.Title>Are you sure you want to continue?</Modal.Title>
            <Modal.Description>You have unsaved changes that will be lost.</Modal.Description>
            <div className="mt-6">
              <ButtonGroup.Root>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button>Continue without saving</ButtonGroup.Button>
                </Modal.CloseTrigger>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button variant="outline" unstyled>Go back</ButtonGroup.Button>
                </Modal.CloseTrigger>
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
  ),
})

export const Large = meta.story({
  render: () => (
    <Modal.Root>
      <Modal.Trigger>
        <Button>Open large modal</Button>
      </Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content className="max-w-4xl">
          <div className="px-8 pb-16 pt-14 w-full max-w-2xl mx-auto">
            <Modal.Title className="text-3xl">Are you sure you want to continue?</Modal.Title>
            <Modal.Description className="mt-4">You have unsaved changes that will be lost.</Modal.Description>
            <div className="mt-6">
              <ButtonGroup.Root>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button>Continue without saving</ButtonGroup.Button>
                </Modal.CloseTrigger>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button variant="outline" unstyled>Go back</ButtonGroup.Button>
                </Modal.CloseTrigger>
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
  ),
})

export const ForcedAction = meta.story({
  render: () => (
    <Modal.Root forceAction>
      <Modal.Trigger>
        <Button>Open modal with forced action</Button>
      </Modal.Trigger>
      <Modal.Backdrop />
      <Modal.Positioner>
        <Modal.Content>
          <div className="p-8 pt-10">
            <Modal.Title>Your session will end soon.</Modal.Title>
            <Modal.Description>
              You've been inactive for too long. Please choose to stay signed in or sign out.
              Otherwise, you'll be signed out automatically in 5 minutes.
            </Modal.Description>
            <div className="mt-6">
              <ButtonGroup.Root>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button>Yes, stay signed in</ButtonGroup.Button>
                </Modal.CloseTrigger>
                <Modal.CloseTrigger>
                  <ButtonGroup.Button variant="outline" unstyled>Sign out</ButtonGroup.Button>
                </Modal.CloseTrigger>
              </ButtonGroup.Root>
            </div>
          </div>
        </Modal.Content>
      </Modal.Positioner>
    </Modal.Root>
  ),
})
