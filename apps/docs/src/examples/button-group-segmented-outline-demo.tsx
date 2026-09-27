import { ButtonGroup } from '@uswds-tailwind/react/button-group'

export default function ButtonGroupSegmentedOutlineDemo() {
  return (
    <ButtonGroup.Root segmented variant="outline" aria-label="Segmented Outline actions">
      <ButtonGroup.Button type="button">Left</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Middle</ButtonGroup.Button>
      <ButtonGroup.Button type="button">Right</ButtonGroup.Button>
    </ButtonGroup.Root>
  )
}
