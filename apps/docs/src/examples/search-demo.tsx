import { Search } from '@uswds-tailwind/react'

export default function SearchDemo() {
  return (
    <div className="max-w-lg">
      <Search.Root>
        <Search.Label>Search</Search.Label>
        <Search.Input />
        <Search.Button>Search</Search.Button>
      </Search.Root>
    </div>
  )
}
