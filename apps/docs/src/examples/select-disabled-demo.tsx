import { Select } from '@uswds-tailwind/react'

export default function SelectDisabledDemo() {
  return (
    <div className="max-w-sm">
      <label htmlFor="select-disabled" className="block">Dropdown label</label>
      <Select.Root disabled>
        <Select.Field id="select-disabled" defaultValue="">
          <option value="" disabled>- Select -</option>
          <option value="value1">Option A</option>
          <option value="value2">Option B</option>
          <option value="value3">Option C</option>
        </Select.Field>
        <Select.Icon />
      </Select.Root>
    </div>
  )
}
