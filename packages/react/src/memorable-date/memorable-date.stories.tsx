import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { Fieldset } from '../fieldset/fieldset'
import { Input } from '../input/input'
import { Select } from '../select/select'
import { MemorableDate } from './memorable-date'

const meta = preview.meta({
  title: 'Components/Memorable Date',
  component: MemorableDate.Root,
})

const months = [
  { value: '', label: '- Select -' },
  { value: '1', label: '01 - January' },
  { value: '2', label: '02 - February' },
  { value: '3', label: '03 - March' },
  { value: '4', label: '04 - April' },
  { value: '5', label: '05 - May' },
  { value: '6', label: '06 - June' },
  { value: '7', label: '07 - July' },
  { value: '8', label: '08 - August' },
  { value: '9', label: '09 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' },
]

export const Default = meta.story({
  render: () => (
    <MemorableDate.Root>
      <MemorableDate.Legend>Date of birth</MemorableDate.Legend>
      <Fieldset.Description>For example: January 19 2000</Fieldset.Description>
      <MemorableDate.Control>
        <MemorableDate.Month />
        <MemorableDate.Day />
        <MemorableDate.Year />
      </MemorableDate.Control>
    </MemorableDate.Root>
  ),
})

export const Composed = meta.story({
  render: () => (
    <MemorableDate.Root>
      <MemorableDate.Legend>Date of birth</MemorableDate.Legend>
      <Fieldset.Description>For example: January 19 2000</Fieldset.Description>
      <MemorableDate.Control>
        <Field.Root className="w-60">
          <Field.Label>Month</Field.Label>
          <Select.Root>
            <Select.Field>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select.Field>
            <Select.Icon />
          </Select.Root>
        </Field.Root>
        <Field.Root className="w-12">
          <Field.Label>Day</Field.Label>
          <Input maxLength={2} inputMode="numeric" pattern="[0-9]*" />
        </Field.Root>
        <Field.Root className="w-20">
          <Field.Label>Year</Field.Label>
          <Input minLength={4} maxLength={4} inputMode="numeric" pattern="[0-9]*" />
        </Field.Root>
      </MemorableDate.Control>
    </MemorableDate.Root>
  ),
})
