import { ButtonGroup } from '@uswds-tailwind/react/button-group'

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup.Root aria-label="Default actions">
      <ButtonGroup.Button type="button" variant="outline">Left</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  )
}
