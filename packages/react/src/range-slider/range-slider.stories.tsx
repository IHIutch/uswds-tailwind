import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { RangeSlider } from './range-slider'

const meta = preview.meta({
  tags: ['new'],
  title: 'Components/Range Slider',
  component: RangeSlider.Root,
})

export const Default = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Range slider</Field.Label>
      <RangeSlider.Root>
        <RangeSlider.Input defaultValue={20} />
      </RangeSlider.Root>
    </Field.Root>
  ),
})

export const Disabled = meta.story({
  render: () => (
    <Field.Root disabled>
      <Field.Label>Range slider</Field.Label>
      <RangeSlider.Root>
        <RangeSlider.Input defaultValue={50} />
      </RangeSlider.Root>
    </Field.Root>
  ),
})
