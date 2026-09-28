import { RangeSlider } from '@uswds-tailwind/react'

export default function RangeSliderDemo() {
  return (
    <form className="max-w-xs">
      <label htmlFor="range-value" className="block">Range slider</label>
      <RangeSlider.Root name="range">
        <RangeSlider.Input id="range-value" min={0} max={100} step={1} defaultValue={20} />
      </RangeSlider.Root>
    </form>
  )
}
