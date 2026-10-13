import { ButtonGroup } from '@uswds-tailwind/react/button-group'

export default function ButtonGroupSegmentedDemo() {
  return (
    <ButtonGroup.Root segmented aria-label="Segmented actions">
      <ButtonGroup.Button type="button">Left</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Middle</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  )
}
