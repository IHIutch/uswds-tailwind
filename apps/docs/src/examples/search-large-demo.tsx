import { Search } from '@uswds-tailwind/react'

export default function SearchLargeDemo() {
  return (
    <div className="max-w-lg">
      <Search.Root size="lg">
        <Search.Label>Search</Search.Label>
        <Search.Input />
        <Search.Button>Search</Search.Button>
      </Search.Root>
    </div>
  )
}
