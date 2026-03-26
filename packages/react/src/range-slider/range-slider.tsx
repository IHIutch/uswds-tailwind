import type { UseRangeSliderProps, UseRangeSliderReturn } from './use-range-slider'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useRangeSlider } from './use-range-slider'

const RangeSliderContext = React.createContext<UseRangeSliderReturn | null>(null)

function useRangeSliderContext() {
  const context = React.useContext(RangeSliderContext)
  if (!context) {
    throw new Error('RangeSlider components must be used within a RangeSlider.Root')
  }
  return context
}

type RangeSliderRootProps = React.HTMLAttributes<HTMLDivElement> & UseRangeSliderProps

function RangeSliderRoot({ className, children, id, disabled, name, ...props }: RangeSliderRootProps) {
  const rangeSlider = useRangeSlider({ id, disabled, name })
  const mergedProps = mergeProps(rangeSlider.getRootProps(), props)

  return (
    <RangeSliderContext.Provider value={rangeSlider}>
      <div
        {...mergedProps}
        className={className}
      >
        {children}
      </div>
    </RangeSliderContext.Provider>
  )
}

type RangeSliderInputProps = React.InputHTMLAttributes<HTMLInputElement>

const RangeSliderInput = React.forwardRef<HTMLInputElement, RangeSliderInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { getInputProps } = useRangeSliderContext()
    const mergedProps = mergeProps(getInputProps(), props)

    return (
      <input
        type="range"
        {...mergedProps}
        className={cx(
          'appearance-none bg-transparent border-none w-full h-10 p-2 pl-px mt-2 focus:outline-4 focus:outline-blue-40v',
          'track:appearance-none track:cursor-pointer track:h-4 track:bg-gray-5 track:rounded-full track:w-full track:border track:border-solid track:border-gray-50',
          'thumb:appearance-none thumb:bg-gray-5 thumb:h-5 thumb:w-5 thumb:-mt-0.75 thumb:rounded-full thumb:ring-2 thumb:ring-gray-50 thumb:focus:bg-white thumb:focus:ring-blue-40v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export const RangeSlider = {
  Root: RangeSliderRoot,
  Input: RangeSliderInput,
}
