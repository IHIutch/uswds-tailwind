import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { TimePicker } from './time-picker'

const meta = preview.meta({
  title: 'Components/Time Picker',
  component: TimePicker.Root,
})

export const Default = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Appointment time</Field.Label>
      <Field.Description>hh:mm</Field.Description>
      <TimePicker.Root>
        <TimePicker.Control>
          <TimePicker.Input />
          <TimePicker.IndicatorGroup>
            <TimePicker.ClearButton />
            <TimePicker.ToggleButton />
          </TimePicker.IndicatorGroup>
        </TimePicker.Control>
        <TimePicker.List>
          {({ options }) => options.map((option, index) => (
            <TimePicker.Item key={option.value} index={index} value={option.value} text={option.text}>
              {option.text}
            </TimePicker.Item>
          ))}
        </TimePicker.List>
      </TimePicker.Root>
    </Field.Root>
  ),
})
