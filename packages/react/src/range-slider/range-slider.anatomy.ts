import { createAnatomy } from '@zag-js/anatomy'

export const rangeSliderAnatomy = createAnatomy('range-slider').parts(
  'root',
  'input',
)
export const parts = rangeSliderAnatomy.build()
