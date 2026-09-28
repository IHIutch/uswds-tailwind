import { TimePicker } from '@uswds-tailwind/react'

export default function TimePickerDemo() {
  return (
    <div className="max-w-xs">
      <TimePicker.Root>
        <TimePicker.Label>Appointment time</TimePicker.Label>
        <div id="appointment-time-hint" className="text-gray-50">hh:mm</div>
        <TimePicker.Control>
          <TimePicker.Input aria-describedby="appointment-time-hint" />
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
    </div>
  )
}
