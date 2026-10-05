import { Input } from '@uswds-tailwind/react'

export default function TextInputDemo() {
  return (
    <div className="max-w-xs">
      <label htmlFor="name" className="block">Name</label>
      <div id="name-hint" className="text-gray-50">Enter your full name</div>
      <Input id="name" aria-describedby="name-hint" />
    </div>
  )
}
