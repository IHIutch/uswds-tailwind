import { Select } from '@uswds-tailwind/react'

export default function SelectDemo() {
  return (
    <div className="max-w-sm">
      <label htmlFor="select-default" className="block">Dropdown label</label>
      <Select.Root>
        <Select.Field id="select-default" defaultValue="">
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
