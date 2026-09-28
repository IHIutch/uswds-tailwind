import { Input, InputGroup } from '@uswds-tailwind/react'

export default function InputGroupDemo() {
  return (
    <div className="space-y-12">
      <div className="max-w-xs">
        <label htmlFor="card-number" className="block">Credit card number</label>
        <InputGroup
          startElement={(
            <div aria-hidden="true" className="select-none pointer-events-none absolute left-0 whitespace-nowrap px-2 text-gray-50 flex items-center">
              <div className="icon-[material-symbols--credit-card-outline] size-6" />
            </div>
          )}
        >
          <Input id="card-number" inputMode="numeric" autoComplete="cc-number" />
        </InputGroup>
      </div>

      <div className="max-w-28">
        <label htmlFor="weight" className="block">Weight, in pounds</label>
        <InputGroup
          endElement={(
            <div aria-hidden="true" className="select-none pointer-events-none absolute right-0 whitespace-nowrap px-2 text-gray-50">
              lbs.
            </div>
          )}
        >
          <Input id="weight" inputMode="decimal" />
        </InputGroup>
      </div>
    </div>
  )
}
