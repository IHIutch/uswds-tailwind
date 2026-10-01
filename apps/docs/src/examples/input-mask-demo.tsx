import { InputMask } from '@uswds-tailwind/react'

export default function InputMaskDemo() {
  return (
    <div className="space-y-12">
      <div className="max-w-xs">
        <InputMask.Root placeholder="___ __ ____">
          <InputMask.Label htmlFor="mask-ssn">Social Security Number</InputMask.Label>
          <div id="hint-ssn" className="text-gray-50">For example, 123 45 6789</div>
          <InputMask.Control>
            <InputMask.Placeholder />
            <InputMask.Input id="mask-ssn" inputMode="numeric" autoComplete="off" aria-describedby="hint-ssn" />
          </InputMask.Control>
        </InputMask.Root>
      </div>

      <div className="max-w-xs">
        <InputMask.Root placeholder="___-___-____">
          <InputMask.Label htmlFor="mask-phone">US Telephone Number</InputMask.Label>
          <div id="hint-phone" className="text-gray-50">For example, 123-456-7890</div>
          <InputMask.Control>
            <InputMask.Placeholder />
            <InputMask.Input id="mask-phone" inputMode="tel" autoComplete="tel" aria-describedby="hint-phone" />
          </InputMask.Control>
        </InputMask.Root>
      </div>

      <div className="max-w-xs">
        <InputMask.Root placeholder="_____-____">
          <InputMask.Label htmlFor="mask-zip">ZIP Code</InputMask.Label>
          <div id="hint-zip" className="text-gray-50">For example, 12345-6789</div>
          <InputMask.Control>
            <InputMask.Placeholder />
            <InputMask.Input id="mask-zip" inputMode="numeric" autoComplete="postal-code" aria-describedby="hint-zip" />
          </InputMask.Control>
        </InputMask.Root>
      </div>

      <div className="max-w-xs">
        <InputMask.Root placeholder="___ ___" charset="A#A #A#">
          <InputMask.Label htmlFor="mask-alpha">Alphanumeric</InputMask.Label>
          <div id="hint-alpha" className="text-gray-50">For example, A1B 2C3</div>
          <InputMask.Control>
            <InputMask.Placeholder />
            <InputMask.Input id="mask-alpha" autoComplete="off" aria-describedby="hint-alpha" />
          </InputMask.Control>
        </InputMask.Root>
      </div>
    </div>
  )
}
