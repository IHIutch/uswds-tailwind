import { Combobox } from '@uswds-tailwind/react'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'avocado', label: 'Avocado' },
  { value: 'banana', label: 'Banana' },
]

export default function ComboBoxDefaultValueDemo() {
  return (
    <div className="max-w-lg">
      <Combobox.Root options={options} defaultValue="banana">
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
              {options.map(option => (
                <Combobox.Item key={option.id} {...option}>
                  {option.label}
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
