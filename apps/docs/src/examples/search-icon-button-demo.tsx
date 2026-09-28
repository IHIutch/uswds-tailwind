import { Search } from '@uswds-tailwind/react'

export default function SearchIconButtonDemo() {
  return (
    <div className="max-w-lg">
      <Search.Root size="sm">
        <Search.Label>Search</Search.Label>
        <Search.Input />
        <Search.Button aria-label="Search" />
      </Search.Root>
    </div>
  )
}
