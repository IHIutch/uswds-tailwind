import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { Select } from './select'

const options = [
  { value: '', label: '- Select -' },
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'avocado', label: 'Avocado' },
  { value: 'banana', label: 'Banana' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
]

const meta = preview.meta({
  title: 'Components/Select',
  component: Select.Root,
  argTypes: {
    disabled: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    invalid: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
})

export const Basic = meta.story({
  args: {
    disabled: false,
    invalid: false,
  },
  render: ({ disabled, invalid }) => (
    <Field.Root disabled={disabled} invalid={invalid}>
      <Field.Label>Dropdown label</Field.Label>
      <Select.Root>
        <Select.Field>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>
  ),
})

export const Disabled = meta.story({
  render: () => (
    <Field.Root disabled>
      <Field.Label>Dropdown label</Field.Label>
      <Select.Root>
        <Select.Field>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>
  ),
})

export const Invalid = meta.story({
  render: () => (
    <Field.Root invalid>
      <Field.Label>Dropdown label</Field.Label>
      <Field.ErrorMessage>Please select an option</Field.ErrorMessage>
      <Select.Root>
        <Select.Field>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </Field.Root>
  ),
})

export const WithCustomIcon = meta.story({
  render: () => (
    <Field.Root>
      <Field.Label>Dropdown label</Field.Label>
      <Select.Root>
        <Select.Field>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select.Field>
        <Select.Icon>
          <div className="icon-[material-symbols--arrow-drop-down] size-6" />
        </Select.Icon>
      </Select.Root>
    </Field.Root>
  ),
})
