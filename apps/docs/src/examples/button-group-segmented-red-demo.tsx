import { ButtonGroup } from '@uswds-tailwind/react/button-group'

export default function ButtonGroupSegmentedRedDemo() {
  return (
    <ButtonGroup.Root segmented variant="red" aria-label="Segmented Red actions">
      <ButtonGroup.Button type="button">Left</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Middle</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  )
}
