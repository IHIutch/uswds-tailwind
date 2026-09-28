import { Combobox } from '@uswds-tailwind/react'

const options = [
  { value: 'apple', text: 'Apple' },
  { value: 'apricot', text: 'Apricot' },
  { value: 'avocado', text: 'Avocado' },
  { value: 'banana', text: 'Banana' },
]

export default function ComboBoxDemo() {
  return (
    <div className="max-w-lg">
      <Combobox.Root options={options}>
        <Combobox.Label>Select a fruit</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.IndicatorGroup>
            <Combobox.ClearButton />
            <Combobox.ToggleButton />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Combobox.List>
          {({ options }) => (
            <>
              {options.map((option, index) => (
                <Combobox.Item key={option.value} index={index} {...option}>
                  {option.text}
                </Combobox.Item>
              ))}
              <Combobox.EmptyItem />
            </>
          )}
        </Combobox.List>
      </Combobox.Root>
    </div>
  )
}
