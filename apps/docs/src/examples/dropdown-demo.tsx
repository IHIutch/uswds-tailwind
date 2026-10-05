import { Dropdown } from '@uswds-tailwind/react/dropdown'

export default function DropdownDemo() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger type="button">Services</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="benefits"><Dropdown.Link href="#benefits">Benefits</Dropdown.Link></Dropdown.Item>
        <Dropdown.Item value="records"><Dropdown.Link href="#records">Records</Dropdown.Link></Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
